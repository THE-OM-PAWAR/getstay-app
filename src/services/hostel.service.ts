import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

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

export interface HostelWithProfile {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  profile?: {
    basicInfo: {
      name: string;
      city?: string;
      state?: string;
      description?: string;
      address?: string;
    };
    propertyDetails: {
      totalRooms?: number;
      accommodationType?: 'boys' | 'girls' | 'coed' | 'separate';
    };
    media: {
      photos: Array<{
        url: string;
        isMain?: boolean;
      }>;
    };
    minRent?: number;
    availableAmenities?: string[];
    roomTypes?: RoomTypeBasic[];
  };
}

export async function getHostels(): Promise<HostelWithProfile[]> {
  try {
    await connectDB();

    const hostelProfiles = await HostelProfile.find({
      isOnlinePresenceEnabled: true,
    })
      .select('hostel slug basicInfo propertyDetails media amenities')
      .lean()
      .limit(8);

    const hostelIds = hostelProfiles.map(p => p.hostel.toString());
    const roomTypes = await RoomType.find({ hostelId: { $in: hostelIds } })
      .select('hostelId name rent images')
      .lean();

    const rentMap = new Map<string, number>();
    const roomTypesMap = new Map<string, RoomTypeBasic[]>();
    
    roomTypes.forEach(rt => {
      const hostelId = rt.hostelId.toString();
      const current = rentMap.get(hostelId) || Infinity;
      rentMap.set(hostelId, Math.min(current, rt.rent));
      
      if (!roomTypesMap.has(hostelId)) {
        roomTypesMap.set(hostelId, []);
      }
      
      // Convert images to plain objects
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

    return hostelProfiles.map(profile => {
      const idStr = profile.hostel.toString();
      const minRent = rentMap.get(idStr);
      const availableAmenities = (profile.amenities || [])
        .filter((a: any) => a.available)
        .map((a: any) => a.name);

      return {
        _id: idStr,
        name: profile.basicInfo.name,
        slug: profile.slug,
        description: profile.basicInfo.description,
        profile: {
          basicInfo: {
            ...profile.basicInfo,
            address: profile.basicInfo.address,
          },
          propertyDetails: profile.propertyDetails,
          media: {
            photos: (profile.media?.photos || []).map((photo: any) => ({
              url: photo.url,
              isMain: !!photo.isMain,
            })),
          },
          minRent: minRent !== undefined && minRent !== Infinity ? minRent : undefined,
          availableAmenities,
          roomTypes: roomTypesMap.get(idStr) || [],
        },
      };
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    return [];
  }
}

export async function getHostelSlugs(): Promise<string[]> {
  try {
    await connectDB();

    const hostelProfiles = await HostelProfile.find({
      isOnlinePresenceEnabled: true,
      slug: { $exists: true, $ne: null },
    })
      .select('slug')
      .lean();

    return hostelProfiles.map(profile => profile.slug).filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching hostel slugs:', error);
    return [];
  }
}

export async function getHostelBySlug(slug: string): Promise<HostelWithProfile | null> {
  try {
    await connectDB();

    const profile = await HostelProfile.findOne({
      slug,
      isOnlinePresenceEnabled: true,
    })
      .select('hostel slug basicInfo propertyDetails media locationInfo amenities safetyFeatures')
      .lean();

    if (!profile) {
      return null;
    }

    return {
      _id: profile.hostel.toString(),
      name: profile.basicInfo.name,
      slug: profile.slug,
      description: profile.basicInfo.description,
      profile: {
        basicInfo: profile.basicInfo,
        propertyDetails: profile.propertyDetails,
        media: {
          photos: (profile.media?.photos || []).map((photo: any) => ({
            url: photo.url,
            isMain: !!photo.isMain,
          })),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching hostel by slug:', error);
    return null;
  }
}

export interface FilterOptions {
  city?: string;
  accommodationType?: string;
  amenities?: string[];
  maxRent?: number;
}

export async function getFilteredHostels(filters: FilterOptions = {}): Promise<HostelWithProfile[]> {
  try {
    await connectDB();

    const query: any = {
      isOnlinePresenceEnabled: true,
    };

    if (filters.city) {
      query['basicInfo.city'] = { $regex: new RegExp(`^${filters.city}$`, 'i') };
    }

    if (filters.accommodationType && filters.accommodationType !== 'all') {
      query['propertyDetails.accommodationType'] = filters.accommodationType;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      query['amenities'] = {
        $all: filters.amenities.map(name => ({
          $elemMatch: { name: name, available: true }
        }))
      };
    }

    const hostelProfiles = await HostelProfile.find(query)
      .select('hostel slug basicInfo propertyDetails media amenities')
      .lean();

    const hostelIds = hostelProfiles.map((p: any) => p.hostel.toString());
    
    const roomTypes = await RoomType.find({ hostelId: { $in: hostelIds } })
      .select('hostelId name rent images')
      .lean();

    const rentMap = new Map<string, number>();
    const roomTypesMap = new Map<string, RoomTypeBasic[]>();
    
    roomTypes.forEach((rt: any) => {
      const hostelId = rt.hostelId.toString();
      const current = rentMap.get(hostelId) || Infinity;
      rentMap.set(hostelId, Math.min(current, rt.rent));
      
      if (!roomTypesMap.has(hostelId)) {
        roomTypesMap.set(hostelId, []);
      }
      
      // Convert images to plain objects
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

    let result = hostelProfiles.map((profile: any) => {
      const idStr = profile.hostel.toString();
      const minRent = rentMap.get(idStr);
      const availableAmenities = (profile.amenities || [])
        .filter((a: any) => a.available)
        .map((a: any) => a.name);

      return {
        _id: idStr,
        name: profile.basicInfo.name,
        slug: profile.slug,
        description: profile.basicInfo.description,
        profile: {
          basicInfo: {
            ...profile.basicInfo,
            address: profile.basicInfo.address,
          },
          propertyDetails: profile.propertyDetails,
          media: {
            photos: (profile.media?.photos || []).map((photo: any) => ({
              url: photo.url,
              isMain: !!photo.isMain,
            })),
          },
          minRent: minRent !== undefined && minRent !== Infinity ? minRent : undefined,
          availableAmenities,
          roomTypes: roomTypesMap.get(idStr) || [],
        },
      };
    });

    if (filters.maxRent && filters.maxRent > 0) {
      result = result.filter(r => r.profile.minRent !== undefined && r.profile.minRent <= filters.maxRent!);
    }

    return result;
  } catch (error) {
    console.error('Error fetching filtered hostels:', error);
    return [];
  }
}
