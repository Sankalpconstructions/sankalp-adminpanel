import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BrandStory from '@/models/BrandStory';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const story = await BrandStory.findById(params.id);
    if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(story);
  } catch (error) {
    console.error('brand-story GET id error', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const updated = await BrandStory.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('brand-story PUT error', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await BrandStory.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, message: 'Deleted' });
  } catch (error) {
    console.error('brand-story DELETE error', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
