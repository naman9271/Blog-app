import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxLength: [300, 'Excerpt cannot be more than 300 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

PostSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
