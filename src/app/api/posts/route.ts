import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    
    interface QueryFilter {
      published: boolean;
      category?: { $regex: string; $options: string };
      tags?: { $in: string[] };
      $or?: Array<{
        title?: { $regex: string; $options: string };
        content?: { $regex: string; $options: string };
        excerpt?: { $regex: string; $options: string };
      }>;
    }
    
    const query: QueryFilter = { published: true };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { title, content, excerpt, category, tags } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const slug = createSlug(title);
    
    // Check if slug already exists
    let uniqueSlug = slug;
    let counter = 1;
    while (await Post.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await Post.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 300) + '...',
      author: session.user.id,
      category,
      tags: tags || [],
      slug: uniqueSlug
    });

    await post.populate('author', 'name email');

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
