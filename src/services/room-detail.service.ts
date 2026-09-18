import connectDB from '@/lib/mongoose/connection';
import { RoomType } from '@/lib/mongoose/models/room-type.model';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';

export interface RoomComponentDetail {
  _id: string;
  name: string;
  description: string;
}

export interface RoomDetailData {
  _id: string;
  name: string;
  description: string;
  rent: number;
  images: Array<{
    url: string;
    title: string;
    isCover: boolean;
  }>;
  components: RoomComponentDetail[];
  hostel: {
    _id: string;
    slug: string;
    name: string;
    city?: string;
    state?: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    banner?: {
      url: string;
    };
    amenities?: Array<{
      name: string;
      description?: string;
      available: boolean;
    }>;
  };
  similarRooms?: Array<{
    _id: string;
    name: string;
    rent: number;
    coverImage?: string;
  }>;
  otherHostels?: Array<{
    _id: string;
    slug: string;
    name: string;
    city?: string;
    accommodationType?: string;
    coverImage?: string;
  }>;
}

export async function getRoomById(roomId: string): Promise<RoomDetailData | null> {
  try {
    await connectDB();

    const room = await RoomType.findById(roomId)
      .select('name description rent images components hostelId')
      .lean();

    if (!room) {
      return null;
    }

    // Fetch components
    const components = await RoomComponent.find({ _id: { $in: room.components } })
      .select('name description')
      .lean();

    // Fetch hostel profile
    const hostelProfile = await HostelProfile.findOne({ hostel: room.hostelId })
      .select('slug basicInfo amenities media')
      .lean();

    if (!hostelProfile) {
      return null;
    }

    // Fetch similar rooms from the same hostel (excluding current room)
    const similarRooms = await RoomType.find({ 
      hostelId: room.hostelId,
      _id: { $ne: room._id }
    })
      .select('name rent images')
      .limit(4)
      .lean();

    // Fetch other hostels in the same city
    const otherHostelProfiles = await HostelProfile.find({
      'basicInfo.city': hostelProfile.basicInfo.city,
      hostel: { $ne: room.hostelId },
      isOnlinePresenceEnabled: true,
    })
      .select('slug basicInfo propertyDetails media hostel')
      .limit(4)
      .lean();

    const serializedData: RoomDetailData = {
      _id: room._id.toString(),
      name: room.name,
      description: room.description,
      rent: room.rent,
      images: (room.images || []).map((img: any) => ({
        url: img.url,
        title: img.title || '',
        isCover: Boolean(img.isCover),
      })),
      components: components.map(c => ({
        _id: c._id.toString(),
        name: c.name,
        description: c.description,
      })),
      hostel: {
        _id: room.hostelId?.toString() || '',
        slug: hostelProfile.slug || '',
        name: hostelProfile.basicInfo.name,
        city: hostelProfile.basicInfo.city,
        state: hostelProfile.basicInfo.state,
        address: hostelProfile.basicInfo.address,
        contactNumber: hostelProfile.basicInfo.contactNumber,
        email: hostelProfile.basicInfo.email,
        banner: hostelProfile.media?.banner ? {
          url: hostelProfile.media.banner.url,
        } : undefined,
        amenities: hostelProfile.amenities?.map((a: any) => ({
          name: a.name,
          description: a.description || '',
          available: a.available,
        })) || [],
      },
      similarRooms: similarRooms.map(r => ({
        _id: r._id.toString(),
        name: r.name,
        rent: r.rent,
        coverImage: r.images?.find((img: any) => img.isCover)?.url || r.images?.[0]?.url,
      })),
      otherHostels: otherHostelProfiles
        .filter(h => h.hostel) // Filter out profiles without hostel reference
        .map(h => ({
          _id: h.hostel.toString(),
          slug: h.slug || '',
          name: h.basicInfo.name,
          city: h.basicInfo.city,
          accommodationType: h.propertyDetails?.accommodationType || 'boys',
          coverImage: h.media?.photos?.[0]?.url || h.media?.banner?.url,
        })),
    };

    return JSON.parse(JSON.stringify(serializedData));
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    return null;
  }
}

export async function getAllRoomIds(): Promise<string[]> {
  try {
    await connectDB();

    // Get all hostels with online presence
    const hostelProfiles = await HostelProfile.find({
      isOnlinePresenceEnabled: true,
    })
      .select('hostel')
      .lean();

    const hostelIds = hostelProfiles.map(p => p.hostel.toString());

    // Get all room types for these hostels
    const rooms = await RoomType.find({ hostelId: { $in: hostelIds } })
      .select('_id')
      .lean();

    return rooms.map(r => r._id.toString());
  } catch (error) {
    console.error('Error fetching room IDs:', error);
    return [];
  }
}
