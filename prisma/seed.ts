import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { slug: "electronics",   name: "Electronics",   imageUrl: "https://picsum.photos/seed/electronics/600/400" },
  { slug: "books",         name: "Books",         imageUrl: "https://picsum.photos/seed/books/600/400" },
  { slug: "home-kitchen",  name: "Home & Kitchen", imageUrl: "https://picsum.photos/seed/kitchen/600/400" },
  { slug: "toys-games",    name: "Toys & Games",  imageUrl: "https://picsum.photos/seed/toys/600/400" },
  { slug: "clothing",      name: "Clothing",      imageUrl: "https://picsum.photos/seed/clothing/600/400" },
  { slug: "beauty",        name: "Beauty",        imageUrl: "https://picsum.photos/seed/beauty/600/400" },
  { slug: "sports",        name: "Sports & Outdoors", imageUrl: "https://picsum.photos/seed/sports/600/400" },
  { slug: "grocery",       name: "Grocery",       imageUrl: "https://picsum.photos/seed/grocery/600/400" },
];

type ProductSeed = {
  slug: string;
  title: string;
  brand: string;
  description: string;
  priceCents: number;
  listPriceCents?: number;
  rating: number;
  ratingCount: number;
  inStock: number;
  imageSeeds: string[];
  bullets: string[];
  category: string;
};

const products: ProductSeed[] = [
  // Electronics
  { slug: "wireless-headphones-pro", title: "SoundOrbit Wireless Over-Ear Headphones, Active Noise Cancelling, 40H Battery", brand: "SoundOrbit", description: "Studio-grade wireless headphones with adaptive noise cancellation, plush memory-foam earcups, and a 40-hour battery on a single charge. Multipoint Bluetooth pairs to your laptop and phone simultaneously.", priceCents: 12999, listPriceCents: 19999, rating: 4.5, ratingCount: 8421, inStock: 80, imageSeeds: ["headphones1", "headphones2", "headphones3", "headphones4"], bullets: ["Active noise cancelling with transparency mode", "40-hour battery life, 5-min quick charge = 5 hours", "Multipoint Bluetooth 5.3 pairing", "Plush memory-foam earcups", "Built-in mic with beamforming"], category: "electronics" },
  { slug: "smart-tv-55", title: "PixelLume 55\" 4K Ultra HD Smart LED TV with HDR10+", brand: "PixelLume", description: "55-inch 4K LED with HDR10+, smart apps, and three HDMI 2.1 ports. Voice remote in the box.", priceCents: 39999, listPriceCents: 54999, rating: 4.4, ratingCount: 3215, inStock: 22, imageSeeds: ["tv1", "tv2", "tv3"], bullets: ["55\" 4K UHD (3840 x 2160)", "HDR10+ and Dolby Vision", "3 x HDMI 2.1", "Built-in voice remote", "Smart apps: streaming, gaming, casting"], category: "electronics" },
  { slug: "ergo-mech-keyboard", title: "TypeForge K90 Wireless Mechanical Keyboard, Hot-Swap, RGB", brand: "TypeForge", description: "Hot-swappable mechanical keyboard with PBT keycaps, gasket-mounted plate, and per-key RGB. USB-C and 2.4 GHz dongle.", priceCents: 14900, rating: 4.7, ratingCount: 1820, inStock: 60, imageSeeds: ["keyboard1", "keyboard2", "keyboard3"], bullets: ["Hot-swappable 5-pin sockets", "Gasket-mounted plate, sound-dampening foam", "PBT double-shot keycaps", "Wired USB-C and 2.4 GHz wireless", "Per-key RGB, 7000 mAh battery"], category: "electronics" },
  { slug: "phone-stand-charger", title: "MagDock 15W Magnetic Wireless Charger Stand", brand: "MagDock", description: "Adjustable magnetic wireless charging stand. Compatible with MagSafe phones.", priceCents: 2499, listPriceCents: 3999, rating: 4.3, ratingCount: 4400, inStock: 200, imageSeeds: ["charger1", "charger2"], bullets: ["15W fast wireless charging", "Magnetic alignment, MagSafe compatible", "Adjustable angle: 0-65 degrees", "Aluminum body", "Includes 1.5m USB-C cable"], category: "electronics" },
  { slug: "smartwatch-fit-9", title: "Pulsetrack Fit 9 Smart Watch with GPS, Heart Rate, SpO2", brand: "Pulsetrack", description: "AMOLED smartwatch with built-in GPS, heart rate, SpO2, and 14-day battery.", priceCents: 17999, rating: 4.4, ratingCount: 6900, inStock: 90, imageSeeds: ["watch1", "watch2", "watch3"], bullets: ["1.43\" AMOLED always-on display", "Built-in dual-band GPS", "24/7 HR and SpO2 monitoring", "14-day battery life", "5 ATM water resistance"], category: "electronics" },

  // Books
  { slug: "the-quiet-protocol", title: "The Quiet Protocol — A Novel", brand: "Iris Penrose", description: "A near-future thriller about a deaf cryptographer who uncovers a global signal. Hardcover, 384 pages.", priceCents: 1699, listPriceCents: 2800, rating: 4.6, ratingCount: 2340, inStock: 150, imageSeeds: ["book1a", "book1b"], bullets: ["Hardcover, 384 pages", "Penrose's debut novel", "Winner of the Astra First Fiction Award", "Includes signed bookplate", "Published by Halberd & Sons"], category: "books" },
  { slug: "javascript-fluent", title: "Fluent JavaScript: Patterns for Modern Web Apps (3rd Edition)", brand: "Dani Marquez", description: "A practical guide to modern JavaScript covering ES2024, async patterns, and architectural patterns.", priceCents: 3499, rating: 4.5, ratingCount: 1102, inStock: 80, imageSeeds: ["book2a", "book2b"], bullets: ["Updated for ES2024", "Covers async/await, generators, structured clone", "Module patterns and dependency injection", "Real-world case studies", "Companion source code on GitHub"], category: "books" },
  { slug: "cookbook-weeknight", title: "Weeknight Forever — 200 Fast Dinners", brand: "Chef Adaeze Okeke", description: "200 fast weeknight recipes that all clock in under 35 minutes. Photography by Kell Ravi.", priceCents: 2299, rating: 4.7, ratingCount: 3500, inStock: 100, imageSeeds: ["book3a", "book3b"], bullets: ["200 recipes, all under 35 minutes", "Color photography on every spread", "Pantry-list and substitution guide", "Includes vegan and gluten-free callouts", "Lay-flat binding"], category: "books" },

  // Home & Kitchen
  { slug: "stand-mixer-pro", title: "BakeWell Pro 6QT Tilt-Head Stand Mixer", brand: "BakeWell", description: "6-quart stainless bowl, 10-speed planetary motion, all-metal gear drive.", priceCents: 24999, listPriceCents: 32999, rating: 4.8, ratingCount: 9800, inStock: 30, imageSeeds: ["mixer1", "mixer2"], bullets: ["6QT stainless bowl with handle", "10-speed planetary motion", "All-metal gear drive", "Includes flat beater, dough hook, whisk", "Power-hub for 12+ attachments"], category: "home-kitchen" },
  { slug: "espresso-machine-classic", title: "Crema Classic Semi-Automatic Espresso Machine", brand: "Crema", description: "Semi-automatic espresso machine with 15-bar pump, dual heating, and steam wand.", priceCents: 34999, rating: 4.4, ratingCount: 1620, inStock: 18, imageSeeds: ["espresso1", "espresso2"], bullets: ["15-bar pump pressure", "Dual heating system: brew + steam", "Pro steam wand with cool-touch grip", "Removable 64oz reservoir", "PID temperature control"], category: "home-kitchen" },
  { slug: "knife-set-8pc", title: "Edgewise Razor 8-Piece Kitchen Knife Block Set", brand: "Edgewise", description: "Forged high-carbon stainless steel knife block set with 8 pieces and storage block.", priceCents: 7999, listPriceCents: 13900, rating: 4.5, ratingCount: 2200, inStock: 60, imageSeeds: ["knives1", "knives2"], bullets: ["High-carbon stainless steel", "Full tang, triple-rivet handles", "Includes 8\" chef, 8\" bread, paring, utility, shears, sharpener", "Solid acacia block", "Lifetime limited warranty"], category: "home-kitchen" },
  { slug: "robot-vacuum-pro", title: "DustBot Auto-Empty Robot Vacuum & Mop", brand: "DustBot", description: "LIDAR-mapping robot vacuum with auto-empty base and mopping pad.", priceCents: 49900, listPriceCents: 69900, rating: 4.3, ratingCount: 5500, inStock: 25, imageSeeds: ["robot1", "robot2"], bullets: ["LIDAR mapping & no-go zones", "Auto-empty base holds 60 days of dust", "Mop & vacuum simultaneously", "App + voice control", "180-min runtime"], category: "home-kitchen" },

  // Toys & Games
  { slug: "lego-bricks-1500", title: "BrickWorks Creator 1500-Piece Builder's Set", brand: "BrickWorks", description: "1500 building bricks across 35 colors plus baseplates and idea book.", priceCents: 4999, rating: 4.7, ratingCount: 4200, inStock: 100, imageSeeds: ["lego1", "lego2"], bullets: ["1500 pieces in 35 colors", "Includes 4 baseplates", "Compatible with all major brands", "Idea book with 50 builds", "Storage tub with sorting tray"], category: "toys-games" },
  { slug: "board-game-cosmic", title: "Cosmic Currents — Strategy Board Game (2-5 players)", brand: "Pelagic Press", description: "Award-winning strategy game where 2-5 players race to build cosmic shipping routes.", priceCents: 5999, rating: 4.6, ratingCount: 1240, inStock: 70, imageSeeds: ["board1", "board2"], bullets: ["2-5 players, 60-90 min", "Ages 12+", "Modular hex board", "Beautiful illustrated cards", "Solo mode included"], category: "toys-games" },
  { slug: "remote-car-rc", title: "Velocity Mk-3 1:10 Scale 4WD RC Buggy", brand: "Velocity", description: "Hobby-grade 4WD RC buggy with 35 mph top speed and waterproof electronics.", priceCents: 14999, rating: 4.5, ratingCount: 870, inStock: 40, imageSeeds: ["rc1", "rc2"], bullets: ["Hobby-grade 4WD chassis", "35 mph top speed", "Waterproof ESC and motor", "2.4 GHz radio with proportional throttle", "2 batteries + dual charger"], category: "toys-games" },

  // Clothing
  { slug: "mens-tee-classic", title: "Northbound Men's Classic Cotton Crew Tee (3-Pack)", brand: "Northbound", description: "100% combed cotton crew tee. Pre-shrunk. Pack of 3.", priceCents: 2499, rating: 4.4, ratingCount: 9100, inStock: 300, imageSeeds: ["tee1", "tee2"], bullets: ["100% combed ringspun cotton", "Pre-shrunk for true-to-size fit", "Tagless neckline", "Reinforced shoulder seams", "Pack of 3 - mix or match colors"], category: "clothing" },
  { slug: "womens-jeans-skinny", title: "Lane & Lake Women's High-Rise Skinny Jeans", brand: "Lane & Lake", description: "Stretch high-rise skinny jeans with a slim-through-the-thigh cut.", priceCents: 4499, listPriceCents: 6999, rating: 4.3, ratingCount: 5200, inStock: 200, imageSeeds: ["jeans1", "jeans2"], bullets: ["High-rise: 11\" front, 14\" back", "98% cotton, 2% spandex", "Slim through thigh, ankle-length", "5-pocket styling", "Machine washable"], category: "clothing" },
  { slug: "running-shoes-air", title: "Vento Air Glide Running Shoes (Men's)", brand: "Vento", description: "Lightweight running shoe with springy foam midsole and breathable mesh upper.", priceCents: 8999, rating: 4.5, ratingCount: 3050, inStock: 80, imageSeeds: ["shoe1", "shoe2"], bullets: ["Springy AirFoam midsole", "Engineered mesh upper", "Reflective heel for low light", "Removable insole", "8mm heel-toe drop"], category: "clothing" },

  // Beauty
  { slug: "skincare-vitc", title: "GlowLab 20% Vitamin C Brightening Serum, 30ml", brand: "GlowLab", description: "20% L-ascorbic acid serum with vitamin E and ferulic acid. Fragrance-free.", priceCents: 2399, rating: 4.5, ratingCount: 12400, inStock: 220, imageSeeds: ["serum1", "serum2"], bullets: ["20% L-ascorbic acid", "Stabilized with vitamin E + ferulic acid", "Fragrance-free, vegan", "Amber glass dropper", "Cruelty-free"], category: "beauty" },
  { slug: "haircare-shampoo", title: "Mintrose Repair Shampoo for Damaged Hair, 16oz", brand: "Mintrose", description: "Sulfate-free repair shampoo with hydrolyzed keratin and argan oil.", priceCents: 1899, rating: 4.4, ratingCount: 4500, inStock: 180, imageSeeds: ["shampoo1", "shampoo2"], bullets: ["Sulfate-free formula", "Hydrolyzed keratin + argan oil", "Color-safe", "16oz pump bottle", "Made in the USA"], category: "beauty" },
  { slug: "lipstick-matte", title: "Bloom & Co. Velvet Matte Lipstick — Mulberry", brand: "Bloom & Co.", description: "Long-wearing matte lipstick with hyaluronic acid for hydration.", priceCents: 1499, rating: 4.6, ratingCount: 880, inStock: 150, imageSeeds: ["lipstick1", "lipstick2"], bullets: ["8-hour wear", "Hyaluronic acid for hydration", "Vegan, cruelty-free", "Velvet matte finish", "Shade: Mulberry"], category: "beauty" },

  // Sports
  { slug: "yoga-mat-premium", title: "AsanaPro Premium Yoga Mat, 6mm Thick, Non-Slip", brand: "AsanaPro", description: "6mm dual-layer non-slip yoga mat with carry strap.", priceCents: 3499, rating: 4.6, ratingCount: 6700, inStock: 140, imageSeeds: ["yoga1", "yoga2"], bullets: ["6mm thickness for joint support", "Dual-layer non-slip surface", "Eco-friendly TPE material", "72\" x 26\" size", "Includes carry strap"], category: "sports" },
  { slug: "dumbbell-set-adj", title: "FormFit 5-50 lb Adjustable Dumbbell (Pair)", brand: "FormFit", description: "Adjustable dumbbells with 10 weight settings, 5 lb to 50 lb.", priceCents: 39999, listPriceCents: 49999, rating: 4.5, ratingCount: 2150, inStock: 18, imageSeeds: ["dumbbell1", "dumbbell2"], bullets: ["5 to 50 lb in 5 lb increments", "Quick-twist dial selector", "Pair of dumbbells included", "Cradles included", "Replaces 10 sets of dumbbells"], category: "sports" },
  { slug: "bike-helmet-aero", title: "Peregrine Aero Road Bike Helmet, MIPS", brand: "Peregrine", description: "MIPS-equipped aero road helmet with 18 vents.", priceCents: 9999, rating: 4.5, ratingCount: 740, inStock: 50, imageSeeds: ["helmet1", "helmet2"], bullets: ["MIPS rotation impact protection", "18 vents for airflow", "In-mold construction", "Adjustable fit dial", "CPSC certified"], category: "sports" },

  // Grocery
  { slug: "coffee-beans-1lb", title: "Daybreak Coffee Roasters Whole Bean Espresso Blend, 1 lb", brand: "Daybreak", description: "Medium-dark roast whole bean espresso. Notes of dark chocolate and brown sugar.", priceCents: 1899, rating: 4.6, ratingCount: 5100, inStock: 250, imageSeeds: ["coffee1", "coffee2"], bullets: ["Whole bean, 1 lb (16 oz)", "Medium-dark roast", "Notes: dark chocolate, brown sugar", "100% Arabica", "Roasted in small batches"], category: "grocery" },
  { slug: "olive-oil-evoo", title: "Olivar Cold-Pressed Extra Virgin Olive Oil, 1L", brand: "Olivar", description: "Cold-pressed Spanish EVOO. Fruity, peppery finish.", priceCents: 2299, rating: 4.7, ratingCount: 3300, inStock: 120, imageSeeds: ["olive1", "olive2"], bullets: ["Cold-pressed", "Single-origin Spanish", "1L dark glass bottle", "Acidity < 0.3%", "Harvested October"], category: "grocery" },
  { slug: "snack-protein-bars", title: "PowerKind Protein Bars, 12 g protein, Variety 12-Pack", brand: "PowerKind", description: "12-pack of protein bars, 12 g protein and 5 g sugar each.", priceCents: 2199, rating: 4.4, ratingCount: 8900, inStock: 220, imageSeeds: ["bar1", "bar2"], bullets: ["12 g protein per bar", "Only 5 g sugar", "Gluten-free", "12 bars, 4 flavors", "No artificial sweeteners"], category: "grocery" },
];

async function main() {
  console.log("Seeding...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const cats = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    cats.set(c.slug, created.id);
  }

  for (const p of products) {
    const images = p.imageSeeds.map((s) => `https://picsum.photos/seed/${s}/800/800`);
    await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        description: p.description,
        priceCents: p.priceCents,
        listPriceCents: p.listPriceCents,
        rating: p.rating,
        ratingCount: p.ratingCount,
        inStock: p.inStock,
        images: JSON.stringify(images),
        bullets: JSON.stringify(p.bullets),
        categoryId: cats.get(p.category)!,
      },
    });
  }

  // Demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      email: "demo@silly.planet",
      name: "Demo Shopper",
      passwordHash,
      addresses: {
        create: {
          fullName: "Demo Shopper",
          line1: "123 Galaxy Way",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          country: "US",
          phone: "555-0100",
          isDefault: true,
        },
      },
    },
  });

  console.log(`Seeded ${categories.length} categories, ${products.length} products, 1 demo user.`);
  console.log("Login: demo@silly.planet / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
