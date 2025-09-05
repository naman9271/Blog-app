const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://namanjain9271:naman9271@4xlabs.9wrdd5w.mongodb.net/blog-app';

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Post schema
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

async function createSampleData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Check current collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Current collections:', collections.map(c => c.name));

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@blog.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@blog.com',
        password: hashedPassword
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample posts
    const samplePosts = [
      {
        title: 'Welcome to BlogSpace',
        content: `# Welcome to BlogSpace!

This is your first blog post. BlogSpace is a modern blogging platform where you can share your thoughts, ideas, and stories with the world.

## Features

- **Rich Text Editor**: Write beautiful posts with markdown support
- **Categories & Tags**: Organize your content effectively
- **User Authentication**: Secure login and registration
- **Responsive Design**: Works great on all devices
- **Comments System**: Engage with your readers

## Getting Started

1. Sign up for an account or sign in if you already have one
2. Create your first post from the dashboard
3. Share your content with the community
4. Engage with other writers through comments

Happy blogging! 🎉`,
        excerpt: 'Welcome to BlogSpace! Learn about the features and how to get started with this modern blogging platform.',
        slug: 'welcome-to-blogspace',
        category: 'Technology',
        tags: ['welcome', 'getting-started', 'blogging'],
        author: adminUser._id,
        published: true
      },
      {
        title: 'The Future of Web Development',
        content: `# The Future of Web Development

Web development is constantly evolving, and staying up-to-date with the latest trends and technologies is crucial for developers.

## Current Trends

### 1. Server-Side Rendering (SSR)
Next.js and other frameworks are making SSR more accessible and performant.

### 2. Static Site Generation (SSG)
JAMstack architecture continues to gain popularity for its performance benefits.

### 3. TypeScript Adoption
More projects are adopting TypeScript for better developer experience and code quality.

### 4. Component-Based Architecture
React, Vue, and other component-based frameworks dominate the frontend landscape.

## Looking Ahead

The future of web development looks exciting with emerging technologies like WebAssembly, Progressive Web Apps, and improved browser APIs.

What do you think will be the next big thing in web development?`,
        excerpt: 'Exploring the current trends and future directions in web development, from SSR to emerging technologies.',
        slug: 'future-of-web-development',
        category: 'Technology',
        tags: ['web-development', 'trends', 'future', 'technology'],
        author: adminUser._id,
        published: true
      },
      {
        title: 'Building Better User Experiences',
        content: `# Building Better User Experiences

User experience (UX) is at the heart of successful web applications. Here are some key principles to follow.

## Core Principles

### 1. Simplicity
Keep interfaces clean and intuitive. Remove unnecessary complexity.

### 2. Consistency
Maintain consistent design patterns throughout your application.

### 3. Accessibility
Ensure your application is usable by everyone, including users with disabilities.

### 4. Performance
Fast-loading applications create better user experiences.

## Best Practices

- Conduct user research and testing
- Iterate based on feedback
- Follow accessibility guidelines (WCAG)
- Optimize for different devices and screen sizes
- Provide clear error messages and feedback

Remember: Great UX is invisible to users but felt in every interaction.`,
        excerpt: 'Learn the core principles and best practices for creating exceptional user experiences in web applications.',
        slug: 'building-better-user-experiences',
        category: 'Business',
        tags: ['ux', 'design', 'user-experience', 'web-design'],
        author: adminUser._id,
        published: true
      }
    ];

    // Check if posts already exist
    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      await Post.insertMany(samplePosts);
      console.log(`✅ Created ${samplePosts.length} sample posts`);
    } else {
      console.log(`✅ ${existingPosts} posts already exist in database`);
    }

    // Display final stats
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    console.log('\n📊 Database Statistics:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Posts: ${postCount}`);
    
    console.log('\n🎉 Sample data setup complete!');
    console.log('You can now:');
    console.log('1. Visit http://localhost:3001 to see your blog');
    console.log('2. Sign in with admin@blog.com / admin123');
    console.log('3. View the collections in MongoDB Compass');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n🔥 Database Connection Issues:');
      console.log('1. Check if your MongoDB Atlas cluster is running');
      console.log('2. Verify your IP address is whitelisted in MongoDB Atlas');
      console.log('3. Check if your MongoDB credentials are correct');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

createSampleData();
