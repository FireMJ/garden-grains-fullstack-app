import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyD_iMEsS8q5FJ-YYMXMzUENs-M16VEujLg';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const placeId = searchParams.get('placeId');
  
  let url = '';
  
  if (placeId) {
    url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API_KEY}`;
  } else if (lat && lng) {
    url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
  } else {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocode proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch geocode' }, { status: 500 });
  }
}
