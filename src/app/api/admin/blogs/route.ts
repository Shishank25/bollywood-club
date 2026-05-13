import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostBySlug } from '@/lib/database/db';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const published = searchParams.get('published') === 'true';
 
    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(post);
    }
 
    const posts = await getBlogPosts(published);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, content, featured_image, author, published } = body;
 
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'slug, title, and content are required' },
        { status: 400 }
      );
    }
 
    const post = await createBlogPost({
      slug,
      title,
      excerpt,
      content,
      featured_image,
      author,
      published,
    });
 
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
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
    const post = await updateBlogPost(parseInt(id), body);
 
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
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
 
    await deleteBlogPost(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}