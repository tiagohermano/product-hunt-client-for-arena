export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  votes_count: number;
  created_at: string;
  website: string;
  thumbnail: {
    image_url: string;
  };
  platforms: string[];
  screenshot_url?: string;
  ranking?: {
    position: number;
    date: string;
  };
}
