# BlogSpace - A Modern Blogging Platform

A comprehensive blogging platform built with Next.js 15, MongoDB, and Tailwind CSS. This application provides a complete solution for creating, managing, and sharing blog posts with user authentication, commenting system, and advanced filtering capabilities.

## Features

### 🔐 Authentication
- User registration and login
- Secure password hashing with bcryptjs
- NextAuth.js integration
- Protected routes for authenticated users

### 📝 Blog Management
- Create, read, update, and delete blog posts
- Rich text content with markdown-style formatting
- Category and tag organization
- Post excerpt and full content display
- Author attribution
- Timestamps for creation and updates

### 💬 Commenting System
- Add comments to blog posts
- User-specific commenting (authentication required)
- Real-time comment display
- Comment author information

### 🔍 Search & Filtering
- Full-text search across posts
- Filter by categories
- Filter by tags
- Pagination for large datasets
- Advanced search capabilities

### 📱 Responsive Design
- Mobile-first responsive design
- Beautiful UI with Tailwind CSS
- Smooth animations and transitions
- Accessible components
- Modern gradient designs

### 🎯 User Dashboard
- Personal post management
- View all your posts
- Quick edit and delete actions
- Post statistics

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog-app
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   ```

4. **Start MongoDB**
   Make sure your MongoDB instance is running.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── posts/         # Post and comment endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── posts/             # Post-related pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility functions
├── models/                # MongoDB models
└── types/                 # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Posts
- `GET /api/posts` - Get all posts (with pagination and filtering)
- `POST /api/posts` - Create a new post
- `GET /api/posts/[slug]` - Get a specific post
- `PUT /api/posts/[slug]` - Update a post
- `DELETE /api/posts/[slug]` - Delete a post
- `GET /api/posts/my-posts` - Get current user's posts

### Comments
- `GET /api/posts/[slug]/comments` - Get post comments
- `POST /api/posts/[slug]/comments` - Add a comment

## Database Models

### User
- name, email, password
- Timestamps (createdAt, updatedAt)

### Post
- title, content, excerpt, slug
- category, tags
- author (reference to User)
- published status
- Timestamps

### Comment
- content
- author (reference to User)
- post (reference to Post)
- Timestamps

## Features Implementation

### Authentication Flow
1. User registers with name, email, and password
2. Password is hashed using bcryptjs
3. NextAuth.js manages sessions and authentication
4. Protected routes redirect to sign-in page

### Post Management
1. Authenticated users can create posts
2. Auto-generated slugs for SEO-friendly URLs
3. Rich category and tag system
4. Full CRUD operations with proper authorization

### Search & Filtering
1. Full-text search across multiple fields
2. Category-based filtering
3. Tag-based filtering
4. Pagination for performance
5. Real-time filter updates

### Responsive Design
1. Mobile-first approach
2. Breakpoints for tablet and desktop
3. Smooth animations and hover effects
4. Accessible form inputs and buttons

## Deployment

### Production Environment Variables
```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=a-strong-random-secret
```

### Build and Start
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please create an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
