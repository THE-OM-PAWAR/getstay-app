import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';

export interface SearchHostelResult {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  accommodationType?: 'boys' | 'girls' | 'coed' | 'separate';
  totalRooms?: number;
  mainPhoto?: string;
  relevanceScore: number;
}

export interface SearchRoomResult {
  _id: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{ name: string; description: string }>;
  hostelName: string;
  hostelSlug: string;
  city?: string;
  state?: string;
  relevanceScore: number;
}

export interface SearchResults {
  hostels: SearchHostelResult[];
  rooms: SearchRoomResult[];
  query: string;
  parsedQuery: {
    location?: string;
    roomType?: string;
    accommodationType?: string;
  };
}

// Parse search query to extract intent
function parseSearchQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Extract location
  const locationMatch = lowerQuery.match(/in\s+([a-z\s]+?)(?:\s|,|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : undefined;
  
  // Extract room type (single, double, triple, sharing)
  let roomType: string | undefined = undefined;
  if (lowerQuery.includes('single') || lowerQuery.includes('1 sharing')) {
    roomType = 'single';
  } else if (lowerQuery.includes('double') || lowerQuery.includes('2 sharing')) {
    roomType = 'double';
  } else if (lowerQuery.includes('triple') || lowerQuery.includes('3 sharing')) {
    roomType = 'triple';
  } else if (lowerQuery.includes('sharing')) {
    roomType = 'sharing';
  }
  
  // Extract accommodation type
  let accommodationType: string | undefined = undefined;
  if (lowerQuery.includes('boys') || lowerQuery.includes('boy')) {
    accommodationType = 'boys';
  } else if (lowerQuery.includes('girls') || lowerQuery.includes('girl')) {
    accommodationType = 'girls';
  }
  
  return { location, roomType, accommodationType };
}

export async function searchHostelsAndRooms(query: string): Promise<SearchResults> {
  try {
    await connectDB();
    
    const parsed = parseSearchQuery(query);
    const lowerQuery = query.toLowerCase().trim();
    const isWildcard = lowerQuery === 'all' || lowerQuery === '*';
    
    // Build hostel query
    const hostelQuery: any = {
      isOnlinePresenceEnabled: true,
    };
    
    if (!isWildcard) {
      hostelQuery.$or = [
        { 'basicInfo.name': { $regex: query, $options: 'i' } },
        { 'basicInfo.description': { $regex: query, $options: 'i' } },
        { 'basicInfo.city': { $regex: query, $options: 'i' } },
        { 'basicInfo.address': { $regex: query, $options: 'i' } },
      ];
    }
    
    // Add location filter
    if (parsed.location) {
      hostelQuery['basicInfo.city'] = { $regex: parsed.location, $options: 'i' };
    }
    
    // Add accommodation type filter
    if (parsed.accommodationType) {
      hostelQuery['propertyDetails.accommodationType'] = parsed.accommodationType;
    }
    
    // Fetch hostels
    const hostels = await HostelProfile.find(hostelQuery)
      .select('hostel slug basicInfo propertyDetails media')
      .lean()
      .limit(20);
    
    // Calculate relevance scores for hostels
    const hostelResults: SearchHostelResult[] = hostels.map(h => {
      let score = 0;
      const name = h.basicInfo.name.toLowerCase();
      const city = h.basicInfo.city?.toLowerCase() || '';
      
      // Exact match bonus (only if not wildcard)
      if (!isWildcard) {
        if (name.includes(lowerQuery)) score += 10;
        if (city.includes(lowerQuery)) score += 8;
      } else {
        // Equal baseline relevance for wildcards
        score += 5;
      }
      
      // Location match
      if (parsed.location && city.includes(parsed.location.toLowerCase())) score += 15;
      
      // Accommodation type match
      if (parsed.accommodationType && h.propertyDetails?.accommodationType === parsed.accommodationType) {
        score += 12;
      }
      
      return {
        _id: h._id.toString(),
        slug: h.slug || '',
        name: h.basicInfo.name,
        description: h.basicInfo.description,
        city: h.basicInfo.city || '',
        state: h.basicInfo.state || '',
        accommodationType: h.propertyDetails?.accommodationType,
        totalRooms: h.propertyDetails?.totalRooms,
        mainPhoto: h.media?.photos?.find(p => p.isMain)?.url || h.media?.photos?.[0]?.url,
        relevanceScore: score,
      };
    });
    
    // Sort by relevance
    hostelResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Build room query
    const hostelIds = hostels.map(h => h.hostel.toString());
    let roomQuery: any = { hostelId: { $in: hostelIds } };
    
    // Add room type filter
    if (parsed.roomType) {
      const roomTypePatterns: Record<string, RegExp> = {
        single: /single|1\s*sharing/i,
        double: /double|2\s*sharing/i,
        triple: /triple|3\s*sharing/i,
        sharing: /sharing/i,
      };
      
      if (roomTypePatterns[parsed.roomType]) {
        roomQuery.name = roomTypePatterns[parsed.roomType];
      }
    }
    
    // Fetch rooms
    const rooms = await RoomType.find(roomQuery)
      .select('name description rent images components hostelId')
      .lean()
      .limit(30);
    
    // Fetch components
    const componentIds = rooms.flatMap(r => r.components);
    const components = await RoomComponent.find({ _id: { $in: componentIds } })
      .select('name description')
      .lean();
    
    const componentMap = new Map(
      components.map(c => [c._id.toString(), { name: c.name, description: c.description }])
    );
    
    // Create hostel map for room results
    const hostelMap = new Map(
      hostels.map(h => [
        h.hostel.toString(),
        {
          name: h.basicInfo.name,
          slug: h.slug || '',
          city: h.basicInfo.city,
          state: h.basicInfo.state,
        }
      ])
    );
    
    // Calculate relevance scores for rooms
    const roomResults: SearchRoomResult[] = rooms.map(r => {
      let score = 0;
      const name = r.name.toLowerCase();
      const hostelInfo = hostelMap.get(r.hostelId);
      
      // Room type match
      if (parsed.roomType) {
        if (name.includes(parsed.roomType)) score += 15;
        if (name.includes('sharing') && parsed.roomType === 'sharing') score += 10;
      }
      
      // Query match
      if (name.includes(lowerQuery)) score += 8;
      
      // Location match (from hostel)
      if (parsed.location && hostelInfo?.city?.toLowerCase().includes(parsed.location.toLowerCase())) {
        score += 12;
      }
      
      return {
        _id: r._id.toString(),
        name: r.name,
        description: r.description,
        rent: r.rent,
        coverImage: r.images?.find(img => img.isCover)?.url || r.images?.[0]?.url,
        components: r.components
          .map(cId => componentMap.get(cId.toString()))
          .filter(Boolean) as Array<{ name: string; description: string }>,
        hostelName: hostelInfo?.name || 'Unknown Hostel',
        hostelSlug: hostelInfo?.slug || '',
        city: hostelInfo?.city,
        state: hostelInfo?.state,
        relevanceScore: score,
      };
    });
    
    // Sort by relevance
    roomResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return {
      hostels: hostelResults.slice(0, 10),
      rooms: roomResults.slice(0, 20),
      query,
      parsedQuery: parsed,
    };
  } catch (error) {
    console.error('Error searching:', error);
    return {
      hostels: [],
      rooms: [],
      query,
      parsedQuery: {},
    };
  }
}
