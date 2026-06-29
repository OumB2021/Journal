export interface Post {
  id: string;
  author: string;
  date: string;
  avatarUrl: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  likeCount: number;
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    date: 'Mar 15, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=1',
    imageUrl:
      'https://images.unsplash.com/photo-1634012243622-ee4212830a8f?w=800&q=80',
    category: 'Lifestyle',
    title: 'The Art of Minimal Design',
    description:
      'Exploring how simplicity shapes modern aesthetics and elevates user experience through the power of restraint and intentionality.',
    likeCount: 142,
  },
  {
    id: '2',
    author: 'Marcus Webb',
    date: 'Mar 12, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=3',
    imageUrl:
      'https://images.unsplash.com/photo-1781787346847-179b5c773b08?w=800&q=80',
    category: 'Technology',
    title: "Dark Mode: A Designer's Guide",
    description:
      'How dark interfaces reduce eye strain while creating sophisticated visual hierarchies in modern app design.',
    likeCount: 89,
  },
  {
    id: '3',
    author: 'Layla S.',
    date: 'Mar 10, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=5',
    imageUrl:
      'https://images.unsplash.com/photo-1721492135372-bb2845371666?w=800&q=80',
    category: 'Architecture',
    title: 'Typography in the Digital Age',
    description:
      'How font choices define brand identity, guide reading flow, and communicate tone in an increasingly screen-dominated world.',
    likeCount: 215,
  },
  {
    id: '4',
    author: 'James Park',
    date: 'Mar 8, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=7',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    category: 'Nature',
    title: 'Mountains at Golden Hour',
    description:
      'Capturing the breathtaking moment when sunlight paints alpine peaks in shades of gold and amber at dusk.',
    likeCount: 301,
  },
  {
    id: '5',
    author: 'Elena Rossi',
    date: 'Mar 5, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=9',
    imageUrl:
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80',
    category: 'Travel',
    title: 'Lost in Santorini',
    description:
      'A visual journey through whitewashed walls, cobalt domes, and cliffside sunsets that define the Greek islands.',
    likeCount: 478,
  },
  {
    id: '6',
    author: 'David Kim',
    date: 'Mar 2, 2024',
    avatarUrl: 'https://i.pravatar.cc/72?img=11',
    imageUrl:
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80',
    category: 'Culture',
    title: 'Street Photography in Tokyo',
    description:
      'The neon-lit alleys and quiet temple gardens of Tokyo coexist in beautiful, unexpected harmony.',
    likeCount: 193,
  },
];
