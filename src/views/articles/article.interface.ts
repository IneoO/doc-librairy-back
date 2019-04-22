interface Post {
  title: string;
  description: string;
  source: string;
  type: 'article' | 'book' | 'video' | 'podcast' | 'study' | 'other';
  url: string;
  tags: string[];
  valid: boolean;
  posterEmail?: string;
  nbClick?: number;
  validedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Post;
