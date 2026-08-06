import { NextRequest, NextResponse } from 'next/server';
import { getExploreResults, ExploreParams } from '@/services/explore.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params: ExploreParams = {
      query: searchParams.get('query') || undefined,
      city: searchParams.get('city') || undefined,
      accommodationType: searchParams.get('accommodationType') || undefined,
      maxRent: searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : undefined,
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 24,
    };

    const results = await getExploreResults(params);

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in explore API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
