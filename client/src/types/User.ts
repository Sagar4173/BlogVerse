// Define the User interface to match server-side model
export interface User {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  postsCount?: number;
  isAdmin?: boolean;
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  location?: string;
  occupation?: string;
  skills?: string[];
  expertise?: string[];
  joinedDate?: string;
  createdAt?: string;
}

// Interface for blog post type
export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  status?: "draft" | "published";
  views?: number;
  likes?: Array<{ user: string; createdAt: string }>;
  comments?: Array<any>;
  likesCount?: number;
  commentsCount?: number;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
