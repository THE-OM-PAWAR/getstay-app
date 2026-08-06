import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export interface ExploreParams {
  // Text search
  query?: string;
  
  // Filters
  city?: string;
  accommodationType?: string;
  minRent?: number;
  maxRent?: number;
  amenities?: string[];
  roomType?: string; // single, double, triple
  
  // Sorting
  sortBy?: 'price-low' | 'price-high' | 'newest';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface RoomTypeBasic {
  _id: string;
  name: string;
  rent: number;
  images: Array<{
    url: string;
    title: string;
    isCover?: boolean;
  }>;
}

export interface HostelResult {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  city: string;
  state?: string;
  accommodationType?: 'boys' | 'girls' | 'coed' | 'separate';
  totalRooms?: number;
  mainPhoto?: string;
  minRent?: number;
  amenities?: string[];
  roomTypes?: RoomTypeBasic[];
}

export interface RoomResult {
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
}

export interface ExploreResults {
  hostels: HostelResult[];
  rooms: RoomResult[];
  total: {
    hostels: number;
    rooms: number;
  };
  appliedFilters: ExploreParams;
}

export async function getExploreResults(params: ExploreParams = {}): Promise<ExploreResults> {
  try {
    await connectDB();

    const {
      query,
      city,
      accommodationType,
      minRent,
      maxRent,
      amenities,
      sortBy = 'newest',
      page = 0,
      limit = 24,
    } = params;

    // Build hostel query
    const hostelQuery: any = { isOnlinePresenceEnabled: true };

    // Text search
    if (query && query.trim()) {
      hostelQuery.$or = [
        { 'basicInfo.name': { $regex: query, $options: 'i' } },
        { 'basicInfo.city': { $regex: query, $options: 'i' } },
        { 'basicInfo.state': { $regex: query, $options: 'i' } },
        { 'basicInfo.description': { $regex: query, $options: 'i' } },
      ];
    }

    // City filter
    if (city && city !== 'all') {
      hostelQuery['basicInfo.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // Accommodation type filter
    if (accommodationType && accommodationType !== 'all') {
      hostelQuery['propertyDetails.accommodationType'] = accommodationType;
    }

    // Amenities filter
    if (amenities && amenities.length > 0) {
      hostelQuery['amenities'] = {
        $all: amenities.map(name => ({
          $elemMatch: { name: name, available: true }
        }))
      };
    }

    // Fetch hostels
    const hostelProfiles = await HostelProfile.find(hostelQuery)
      .select('hostel slug basicInfo propertyDetails media amenities')
      .lean()
      .limit(limit)
      .skip(page * limit);

    const hostelIds = hostelProfiles.map((p: any) => p.hostel.toString());

    // Fetch room types
    const roomTypeQuery: any = { hostelId: { $in: hostelIds } };
    
    if (maxRent && maxRent > 0) {
      roomTypeQuery.rent = { $lte: maxRent };
    }
    if (minRent && minRent > 0) {
      roomTypeQuery.rent = { ...roomTypeQuery.rent, $gte: minRent };
    }

    const roomTypes = await RoomType.find(roomTypeQuery)
      .select('hostelId name rent images description components')
      .lean();

    // Calculate min rent for each hostel
    const rentMap = new Map<string, number>();
    const roomTypesMap = new Map<string, RoomTypeBasic[]>();
    
    roomTypes.forEach((rt: any) => {
      const hostelId = rt.hostelId.toString();
      const current = rentMap.get(hostelId) || Infinity;
      rentMap.set(hostelId, Math.min(current, rt.rent));
      
      if (!roomTypesMap.has(hostelId)) {
        roomTypesMap.set(hostelId, []);
      }
      
      const plainImages = (rt.images || []).map((img: any) => ({
        url: img.url,
        title: img.title,
        isCover: img.isCover || false,
      }));
      
      roomTypesMap.get(hostelId)!.push({
        _id: rt._id.toString(),
        name: rt.name,
        rent: rt.rent,
        images: plainImages,
      });
    });

    // Map hostels
    let hostels: HostelResult[] = hostelProfiles.map((profile: any) => {
      const idStr = profile.hostel.toString();
      const minRentValue = rentMap.get(idStr);
      const availableAmenities = (profile.amenities || [])
        .filter((a: any) => a.available)
        .map((a: any) => a.name);

      return {
        _id: idStr,
        name: profile.basicInfo.name,
        slug: profile.slug,
        description: profile.basicInfo.description,
        city: profile.basicInfo.city || '',
        state: profile.basicInfo.state,
        accommodationType: profile.propertyDetails?.accommodationType,
        totalRooms: profile.propertyDetails?.totalRooms || 0,
        mainPhoto: profile.media?.photos?.find((p: any) => p.isMain)?.url || profile.media?.photos?.[0]?.url,
        minRent: minRentValue !== undefined && minRentValue !== Infinity ? minRentValue : undefined,
        amenities: availableAmenities,
        roomTypes: roomTypesMap.get(idStr) || [],
      };
    });

    // Apply rent filter to hostels
    if (maxRent && maxRent > 0) {
      hostels = hostels.filter(h => h.minRent !== undefined && h.minRent <= maxRent);
    }

    // Sort hostels
    if (sortBy === 'price-low') {
      hostels.sort((a, b) => (a.minRent || Infinity) - (b.minRent || Infinity));
    } else if (sortBy === 'price-high') {
      hostels.sort((a, b) => (b.minRent || 0) - (a.minRent || 0));
    }

    // Map rooms for detailed view
    const rooms: RoomResult[] = roomTypes.map((rt: any) => {
      const hostelProfile = hostelProfiles.find((p: any) => p.hostel.toString() === rt.hostelId.toString());
      
      return {
        _id: rt._id.toString(),
        name: rt.name,
        description: rt.description || '',
        rent: rt.rent,
        coverImage: rt.images?.find((img: any) => img.isCover)?.url || rt.images?.[0]?.url,
        components: (rt.components || []).map((c: any) => ({
          name: c.name || '',
          description: c.description || '',
        })),
        hostelName: hostelProfile?.basicInfo?.name || '',
        hostelSlug: hostelProfile?.slug || '',
        city: hostelProfile?.basicInfo?.city,
        state: hostelProfile?.basicInfo?.state,
      };
    });

    // Get total counts
    const totalHostels = await HostelProfile.countDocuments(hostelQuery);

    return {
      hostels,
      rooms,
      total: {
        hostels: totalHostels,
        rooms: rooms.length,
      },
      appliedFilters: params,
    };
  } catch (error) {
    console.error('Error in getExploreResults:', error);
    return {
      hostels: [],
      rooms: [],
      total: { hostels: 0, rooms: 0 },
      appliedFilters: params,
    };
  }
}
