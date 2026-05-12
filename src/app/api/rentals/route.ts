import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RentalProperty from '@/models/RentalProperty';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get('type');

    await connectDB();
    
    const query = propertyType ? { propertyType } : {};
    const properties = await RentalProperty.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(properties, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch rental properties:', error);
    return NextResponse.json({ error: 'Failed to fetch rental properties' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const newProperty = await RentalProperty.create(body);
    return NextResponse.json(newProperty, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Failed to create rental property:', error);
    return NextResponse.json({ error: 'Failed to create rental property' }, { status: 500, headers: corsHeaders });
  }
}
