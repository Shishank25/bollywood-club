import { getSectionsByPageId, createSection, updateSection, deleteSection, getSectionById } from '@/lib/database/db';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get('pageId');
    const sectionId = searchParams.get('sectionId');
 
    if (sectionId) {
      const section = await getSectionById(parseInt(sectionId));
      return NextResponse.json(section);
    }
 
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      );
    }
 
    const sections = await getSectionsByPageId(parseInt(pageId));
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, sectionId, type, title, content, metadata, display_order } = body;
 
    if (!pageId || !sectionId || !type) {
      return NextResponse.json(
        { error: 'pageId, sectionId, and type are required' },
        { status: 400 }
      );
    }
 
    const section = await createSection(pageId, sectionId, type, {
      title,
      content,
      metadata,
      display_order,
    });
 
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
 
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
 
    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }
 
    const body = await request.json();
    const section = await updateSection(parseInt(id), body);
 
    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}
 
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
 
    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }
 
    await deleteSection(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}