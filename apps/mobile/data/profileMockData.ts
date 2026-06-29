export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
}

export interface ProfilePost {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  hashtags: string[];
  date: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  comments: Comment[];
}

export interface ProfileUser {
  name: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
  followerCount: string;
  followingCount: number;
}

export const PROFILE_USER: ProfileUser = {
  name: 'Alex Morgan',
  bio: 'Writer, designer & coffee enthusiast. Sharing thoughts on creativity and the digital world.',
  avatarUrl: 'https://images.unsplash.com/photo-1759399496557-dd272f61f6cb?w=200&q=80',
  postCount: 42,
  followerCount: '1.2K',
  followingCount: 234,
};

export const PROFILE_POSTS: ProfilePost[] = [
  {
    id: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1609213450001-ab286b36fd11?w=800&q=80',
    category: 'Architecture',
    title: 'Morning Light Through Glass',
    description:
      'Morning light through the coffee shop window — some moments deserve to be slowed down and savoured. ☕',
    hashtags: ['#photography', '#morning', '#coffeeshop', '#lifestyle'],
    date: 'June 24, 2026',
    likeCount: 2400,
    commentCount: 138,
    shareCount: 56,
    comments: [
      {
        id: 'c1',
        author: 'Sarah K.',
        avatarUrl: 'https://i.pravatar.cc/48?img=2',
        text: 'Absolutely stunning shot! 🤩',
      },
      {
        id: 'c2',
        author: 'james_r',
        avatarUrl: 'https://i.pravatar.cc/48?img=4',
        text: 'Love the mood here, so peaceful',
      },
    ],
  },
  {
    id: 'p2',
    imageUrl: 'https://images.unsplash.com/photo-1668310153180-7eab752d2c9a?w=800&q=80',
    category: 'Nature',
    title: 'Autumn in the Wild',
    description:
      'There is a quiet beauty in the changing of seasons. Every leaf a small goodbye, every gust a fresh beginning.',
    hashtags: ['#nature', '#autumn', '#photography', '#seasons'],
    date: 'June 20, 2026',
    likeCount: 1892,
    commentCount: 94,
    shareCount: 38,
    comments: [
      {
        id: 'c1',
        author: 'emily_h',
        avatarUrl: 'https://i.pravatar.cc/48?img=6',
        text: 'This is magical 🍂',
      },
      {
        id: 'c2',
        author: 'mikeshots',
        avatarUrl: 'https://i.pravatar.cc/48?img=8',
        text: 'The colours are incredible!',
      },
    ],
  },
  {
    id: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1702893750231-d0788506cf4e?w=800&q=80',
    category: 'Travel',
    title: 'City Lights at Dusk',
    description:
      'Every city tells a different story when the sun goes down. This one whispered of ambition and rest in equal measure.',
    hashtags: ['#travel', '#cityscape', '#urban', '#nightphotography'],
    date: 'June 16, 2026',
    likeCount: 3100,
    commentCount: 207,
    shareCount: 89,
    comments: [
      {
        id: 'c1',
        author: 'trav_lens',
        avatarUrl: 'https://i.pravatar.cc/48?img=10',
        text: 'Which city is this?? Stunning!',
      },
      {
        id: 'c2',
        author: 'nightowl_photos',
        avatarUrl: 'https://i.pravatar.cc/48?img=12',
        text: 'Night photography goals 🌆',
      },
    ],
  },
  {
    id: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1602399481667-07536109851e?w=800&q=80',
    category: 'Food',
    title: 'Table for Two',
    description:
      'Good food, great company. The best kind of evening — unhurried, warm, and full of laughter.',
    hashtags: ['#food', '#dining', '#lifestyle', '#goodvibes'],
    date: 'June 11, 2026',
    likeCount: 1540,
    commentCount: 72,
    shareCount: 24,
    comments: [
      {
        id: 'c1',
        author: 'foodie_vida',
        avatarUrl: 'https://i.pravatar.cc/48?img=14',
        text: 'This looks incredible! 😍',
      },
      {
        id: 'c2',
        author: 'chefmark',
        avatarUrl: 'https://i.pravatar.cc/48?img=16',
        text: 'Beautiful presentation',
      },
    ],
  },
  {
    id: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=800&q=80',
    category: 'Lifestyle',
    title: 'Midday Pause',
    description:
      'Taking a moment to breathe between the chaos. Stillness is not laziness — it is necessary.',
    hashtags: ['#lifestyle', '#mindfulness', '#calm', '#slowliving'],
    date: 'June 5, 2026',
    likeCount: 2210,
    commentCount: 115,
    shareCount: 47,
    comments: [
      {
        id: 'c1',
        author: 'zen_vibes',
        avatarUrl: 'https://i.pravatar.cc/48?img=18',
        text: 'This is everything I need right now ✨',
      },
      {
        id: 'c2',
        author: 'slowliving',
        avatarUrl: 'https://i.pravatar.cc/48?img=20',
        text: 'Love this aesthetic',
      },
    ],
  },
  {
    id: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1703222156184-7e9bf9d43300?w=800&q=80',
    category: 'Architecture',
    title: 'Glass and Steel',
    description:
      'Modern architecture never ceases to amaze me. The dialogue between reflection and structure is endlessly fascinating.',
    hashtags: ['#architecture', '#design', '#urban', '#glass'],
    date: 'May 28, 2026',
    likeCount: 1780,
    commentCount: 88,
    shareCount: 31,
    comments: [
      {
        id: 'c1',
        author: 'arch_daily',
        avatarUrl: 'https://i.pravatar.cc/48?img=22',
        text: 'Fantastic composition!',
      },
      {
        id: 'c2',
        author: 'designgeek',
        avatarUrl: 'https://i.pravatar.cc/48?img=24',
        text: 'The angles are perfect 📐',
      },
    ],
  },
];
