import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import RentalProperty from '@/models/RentalProperty';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get('type');

    await connectToDatabase();
    
    const query = propertyType ? { propertyType } : {};
    const properties = await RentalProperty.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Failed to fetch rental properties:', error);
    return NextResponse.json({ error: 'Failed to fetch rental properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const newProperty = await RentalProperty.create(body);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Failed to create rental property:', error);
    return NextResponse.json({ error: 'Failed to create rental property' }, { status: 500 });
  }
}
