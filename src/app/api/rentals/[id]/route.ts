import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import RentalProperty from '@/models/RentalProperty';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const property = await RentalProperty.findById(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const updatedProperty = await RentalProperty.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deletedProperty = await RentalProperty.findByIdAndDelete(params.id);
    if (!deletedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
