export type Category = {
  slug: string;
  name: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { slug: "mobiles", name: "Mobiles", emoji: "📱" },
  { slug: "vehicles", name: "Vehicles", emoji: "🚗" },
  { slug: "electronics", name: "Electronics", emoji: "💻" },
  { slug: "tv-audio", name: "TV & Audio", emoji: "📺" },
  { slug: "cameras", name: "Cameras", emoji: "📷" },
  { slug: "home", name: "Home & Furniture", emoji: "🛋️" },
  { slug: "fashion", name: "Fashion", emoji: "👕" },
  { slug: "sports", name: "Sports", emoji: "⚽" },
];

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "used", label: "Used" },
] as const;

export const CATEGORY_IMAGE_FALLBACK: Record<string, string> = {
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
  vehicles: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
  electronics: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
  "tv-audio": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop",
  cameras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
  home: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
  sports: "https://images.unsplash.com/photo-1461896836934-bd45ba8e6e5f?w=800&h=600&fit=crop",
};

export function getFallbackImage(category: string) {
  return CATEGORY_IMAGE_FALLBACK[category] ?? CATEGORY_IMAGE_FALLBACK.home;
}

export type DemoAd = {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  condition: string;
  image: string;
  description: string;
  seller: string;
};

const BASE_DEMO_ADS: DemoAd[] = [
  // ── Mobiles ──
  { id: "demo-1", title: "iPhone 15 Pro Max — Titanium Black", price: 1149, location: "San Francisco, CA", category: "mobiles", condition: "like_new", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop", description: "Flagship phone in pristine condition. 256GB, full box, AppleCare+ until 2026.", seller: "Daniel R." },
  { id: "demo-2", title: "Samsung Galaxy S24 Ultra", price: 999, location: "New York, NY", category: "mobiles", condition: "new", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop", description: "Latest flagship with S Pen, 512GB storage, all accessories included.", seller: "Sarah K." },
  { id: "demo-3", title: "Google Pixel 8 Pro", price: 799, location: "Seattle, WA", category: "mobiles", condition: "good", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop", description: "Excellent camera performance, 128GB, minor wear but fully functional.", seller: "Mike T." },

  // ── Vehicles ──
  { id: "demo-4", title: "BMW 5 Series — Carbon Black", price: 38500, location: "Austin, TX", category: "vehicles", condition: "good", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop", description: "Single owner, 42k miles, full service history. Premium package, panoramic roof.", seller: "Marcus L." },
  { id: "demo-5", title: "Tesla Model 3 — Pearl White", price: 28900, location: "Los Angeles, CA", category: "vehicles", condition: "like_new", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop", description: "2022 model, autopilot, 35k miles, supercharger access included.", seller: "Emma W." },
  { id: "demo-6", title: "Honda Civic Type R", price: 26500, location: "Miami, FL", category: "vehicles", condition: "good", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27c5?w=800&h=600&fit=crop", description: "Manual transmission, 28k miles, track-ready with maintenance records.", seller: "Carlos R." },

  // ── Electronics ──
  { id: "demo-7", title: "MacBook Pro 14\" M3 — Space Black", price: 1899, location: "Brooklyn, NY", category: "electronics", condition: "new", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop", description: "Sealed in box. 16GB RAM, 512GB SSD. Bought last week, switching to desktop.", seller: "Priya M." },
  { id: "demo-8", title: "Dell XPS 13 Plus", price: 1299, location: "Chicago, IL", category: "electronics", condition: "like_new", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop", description: "Intel i7, 16GB RAM, 512GB SSD, touchscreen display, barely used.", seller: "Alex J." },
  { id: "demo-9", title: "Gaming PC - RTX 4070", price: 1899, location: "Denver, CO", category: "electronics", condition: "good", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop", description: "Custom build: i7-13700K, 32GB RAM, RTX 4070, 1TB SSD, RGB everything.", seller: "Ryan P." },

  // ── TV & Audio ──
  { id: "demo-10", title: "55\" OLED Smart TV — 4K Dolby Vision", price: 899, location: "Seattle, WA", category: "tv-audio", condition: "like_new", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop", description: "Bought 3 months ago, perfect picture. Includes wall mount and original remote.", seller: "Aisha K." },
  { id: "demo-11", title: "Premium Wireless Noise-Cancelling Headphones", price: 249, location: "Chicago, IL", category: "tv-audio", condition: "good", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop", description: "30-hour battery, plush leather earcups, comes with hard travel case.", seller: "Liam C." },
  { id: "demo-12", title: "Sony WH-1000XM5 Headphones", price: 299, location: "Boston, MA", category: "tv-audio", condition: "new", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop", description: "Industry-leading noise cancellation, 30-hour battery, premium comfort.", seller: "Nina S." },

  // ── Cameras ──
  { id: "demo-13", title: "Mirrorless Camera + 24-70mm Lens", price: 1450, location: "Portland, OR", category: "cameras", condition: "good", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop", description: "Full-frame body, ~12k shutter count, includes battery grip and SD cards.", seller: "Noor S." },
  { id: "demo-14", title: "Canon EOS R6 Mark II", price: 1899, location: "Vancouver, BC", category: "cameras", condition: "like_new", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop", description: "20MP full-frame, 4K video, IBIS, dual card slots, excellent condition.", seller: "David L." },
  { id: "demo-15", title: "DJI Mavic 3 Drone", price: 1499, location: "Phoenix, AZ", category: "cameras", condition: "new", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop", description: "Professional drone with 4/3 CMOS sensor, 5.1K video, RTK module included.", seller: "Tom H." },

  // ── Home & Furniture ──
  { id: "demo-16", title: "Modern Leather Sofa Set", price: 1299, location: "Dallas, TX", category: "home", condition: "good", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop", description: "3-piece sectional sofa, genuine leather, 2 years old, excellent condition.", seller: "Maria G." },
  { id: "demo-17", title: "Dining Table Set - 6 Chairs", price: 899, location: "Atlanta, GA", category: "home", condition: "like_new", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop", description: "Solid oak table with 6 matching chairs, expandable, perfect for family dinners.", seller: "Robert M." },
  { id: "demo-18", title: "King Size Bed Frame + Mattress", price: 699, location: "San Diego, CA", category: "home", condition: "new", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop", description: "Platform bed with memory foam mattress, headboard included, still in plastic.", seller: "Lisa P." },

  // ── Fashion ──
  { id: "demo-19", title: "Designer Leather Jacket", price: 299, location: "Las Vegas, NV", category: "fashion", condition: "good", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop", description: "Genuine leather bomber jacket, size M, barely worn, authentic brand.", seller: "Jessica R." },
  { id: "demo-20", title: "Nike Air Max Collection", price: 149, location: "Orlando, FL", category: "fashion", condition: "new", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", description: "Brand new sneakers, size 10, original box, never worn.", seller: "Kevin B." },
  { id: "demo-21", title: "Rolex Submariner Watch", price: 8999, location: "Miami, FL", category: "fashion", condition: "like_new", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=600&fit=crop", description: "Stainless steel, automatic movement, full set with papers, excellent condition.", seller: "Antonio V." },

  // ── Sports ──
  { id: "demo-22", title: "Peloton Bike - Premium Package", price: 1899, location: "Salt Lake City, UT", category: "sports", condition: "good", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=600&fit=crop", description: "Top-tier Peloton bike with 1 year premium membership. HD touchscreen, heart rate monitor, perfect for home workouts.", seller: "Jennifer L." },
  { id: "demo-23", title: "Wilson Pro Tennis Racket", price: 199, location: "Tampa, FL", category: "sports", condition: "new", image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop", description: "Professional-grade Wilson tennis racket, precision strung with premium gut. Includes protective cover and grip tape.", seller: "Mark D." },
  { id: "demo-24", title: "Treadmill - NordicTrack Commercial", price: 1299, location: "Minneapolis, MN", category: "sports", condition: "like_new", image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop", description: "Commercial-grade NordicTrack treadmill with iFit integration. 3 years old, meticulously maintained, includes 2-year warranty.", seller: "Susan W." },
  { id: "demo-25", title: "Basketball - Spalding NBA Official", price: 49, location: "Houston, TX", category: "sports", condition: "new", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&h=600&fit=crop", description: "Official NBA Spalding basketball, premium composite leather. Excellent grip for indoor and outdoor play.", seller: "Tyler S." },
  { id: "demo-26", title: "Titleist Golf Clubs Complete Set", price: 799, location: "Phoenix, AZ", category: "sports", condition: "good", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=600&fit=crop", description: "Premium Titleist golf set: driver, irons, wedges, putter. Includes high-quality bag and accessories.", seller: "Karen W." },
  { id: "demo-27", title: "Premium Yoga Mat - Eco-Friendly", price: 39, location: "Denver, CO", category: "sports", condition: "new", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=600&fit=crop", description: "High-quality, non-slip yoga mat made from sustainable materials. 6mm thick, perfect for all yoga poses and pilates.", seller: "Anna K." },
];

function repeatAdsToFivePerCategory(items: DemoAd[]): DemoAd[] {
  return CATEGORIES.flatMap((category) => {
    const samples = items.filter((item) => item.category === category.slug);
    if (!samples.length) return [];

    return Array.from({ length: 5 }, (_, index) => {
      const source = samples[index % samples.length];
      const title = index === 0 ? source.title : `${source.title} (${index + 1})`;
      return {
        ...source,
        id: `${source.id}-${index + 1}`,
        title,
        price: source.price + index * 20,
        seller: index === 0 ? source.seller : `${source.seller} ${index + 1}`,
        image: source.image,
      };
    });
  });
}

export const DEMO_ADS = repeatAdsToFivePerCategory(BASE_DEMO_ADS);

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function conditionLabel(c: string) {
  return CONDITIONS.find((x) => x.value === c)?.label ?? c;
}

export function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
