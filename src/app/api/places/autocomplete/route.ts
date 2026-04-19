import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyD_iMEsS8q5FJ-YYMXMzUENs-M16VEujLg';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('input');
  
  if (!input) {
    return NextResponse.json({ error: 'Missing input parameter' }, { status: 400 });
  }
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:za&location=-33.9249,18.4241&radius=50000&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
