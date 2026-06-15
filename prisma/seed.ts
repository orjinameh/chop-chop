import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@chopchop.ng" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@chopchop.ng",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "rice-dishes" },
      update: {},
      create: { name: "Rice Dishes", slug: "rice-dishes", description: "Nigerian rice classics", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "proteins" },
      update: {},
      create: { name: "Proteins & Sides", slug: "proteins", description: "Grilled, fried, and stewed", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "fast-food" },
      update: {},
      create: { name: "Fast Food", slug: "fast-food", description: "Quick bites and street favourites", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "soups-swallow" },
      update: {},
      create: { name: "Soups & Swallow", slug: "soups-swallow", description: "Traditional Nigerian soups", sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: "drinks" },
      update: {},
      create: { name: "Drinks", slug: "drinks", description: "Cold drinks and fresh juice", sortOrder: 5 },
    }),
  ]);

  const [riceDishes, proteins, fastFood, soupsSwallow, drinks] = categories;
  console.log(`✅ ${categories.length} categories created`);

  const menuItems = [
    {
      name: "Party Jollof Rice",
      slug: "party-jollof-rice",
      description: "The legendary smoky party jollof cooked over firewood with rich tomato base. Comes with coleslaw.",
      price: 2500,
      categoryId: riceDishes.id,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1666190092689-e3968aa0c32c?q=80&w=600",
    },
    {
      name: "Fried Rice",
      slug: "fried-rice",
      description: "Nigerian-style fried rice with mixed vegetables, liver, and seasoning. A household favourite.",
      price: 2300,
      categoryId: riceDishes.id,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    },
    {
      name: "Native Jollof Rice",
      slug: "native-jollof-rice",
      description: "Ofada-style rice cooked with palm oil stew and locust beans. Bold and traditional.",
      price: 2800,
      categoryId: riceDishes.id,
      image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600",
    },
    {
      name: "Coconut Rice",
      slug: "coconut-rice",
      description: "Fragrant rice cooked in coconut milk, served with fried plantain and stew.",
      price: 2600,
      categoryId: riceDishes.id,
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80",
    },
    {
      name: "Grilled Chicken (Full)",
      slug: "grilled-chicken-full",
      description: "Whole chicken marinated in suya spices and grilled to perfection. Comes with pepper sauce.",
      price: 4500,
      categoryId: proteins.id,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80",
    },
    {
      name: "Peppered Gizzard",
      slug: "peppered-gizzard",
      description: "Tender chicken gizzard tossed in fiery pepper sauce. A crowd pleaser.",
      price: 1800,
      categoryId: proteins.id,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
    },
    {
      name: "Fried Plantain",
      slug: "fried-plantain",
      description: "Sweet, golden dodo fried to caramelised perfection.",
      price: 800,
      categoryId: proteins.id,
      image: "https://images.unsplash.com/photo-1563336522-c3bd728d3b45?q=80&w=600",
    },
    {
      name: "Moi Moi",
      slug: "moi-moi",
      description: "Steamed bean pudding with fish, egg, and crayfish. Soft, rich, and filling.",
      price: 900,
      categoryId: proteins.id,
      image: "https://happilycooking.com/wp-content/uploads/2025/05/Moi-Moi.webp",
    },
    {
      name: "Chicken Shawarma",
      slug: "chicken-shawarma",
      description: "Grilled chicken strips, fresh vegetables, and garlic sauce wrapped in soft flatbread.",
      price: 2200,
      categoryId: fastFood.id,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1719282431565-3b30bb7d2658?q=80&w=600",
    },
    {
      name: "Beef Burger",
      slug: "beef-burger",
      description: "Juicy beef patty with lettuce, tomato, caramelised onions, and special sauce.",
      price: 2500,
      categoryId: fastFood.id,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    },
    {
      name: "Pepperoni Pizza (Medium)",
      slug: "pepperoni-pizza",
      description: "Classic pepperoni on a crispy thin crust with mozzarella and tomato sauce.",
      price: 5500,
      categoryId: fastFood.id,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    },
    {
      name: "Suya (Beef)",
      slug: "suya-beef",
      description: "Northern Nigerian spiced beef skewers served with onion, tomato, and yaji powder.",
      price: 2000,
      categoryId: fastFood.id,
      isFeatured: true,
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
    },
    {
      name: "Puff Puff (6 pcs)",
      slug: "puff-puff",
      description: "Soft, fluffy deep-fried dough balls. The ultimate Nigerian street snack.",
      price: 600,
      categoryId: fastFood.id,
      image: "https://yummieliciouz.com/wp-content/uploads/2022/08/African-puff-puff-recipe-1024x683.png",
    },
    {
      name: "Egusi Soup + Eba",
      slug: "egusi-soup-eba",
      description: "Rich melon seed soup with assorted meat, stock fish, and leafy vegetables. Served with eba.",
      price: 3200,
      categoryId: soupsSwallow.id,
      isFeatured: true,
      image: "https://i0.wp.com/chefsbase.com/wp-content/uploads/2025/07/eba-and-egusi-soup.webp?w=700&ssl=1",
    },
    {
      name: "Banga Soup + Starch",
      slug: "banga-soup-starch",
      description: "Delta-style palm nut soup with periwinkle, catfish, and aromatic spices. Served with starch.",
      price: 3500,
      categoryId: soupsSwallow.id,
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    },
    {
      name: "Okra Soup + Pounded Yam",
      slug: "okra-soup-pounded-yam",
      description: "Thick okra soup with assorted meat and crayfish. Served with smooth pounded yam.",
      price: 3000,
      categoryId: soupsSwallow.id,
      image: "https://www.cubanacuisine.com/web/pics/menu-pounded-yam---okra-soup-1665737876-image.jpeg",
    },
    {
      name: "Zobo Drink (500ml)",
      slug: "zobo-drink",
      description: "Chilled hibiscus flower drink infused with ginger, pineapple, and natural flavours.",
      price: 500,
      categoryId: drinks.id,
      image: "https://www.dashofjazz.com/wp-content/uploads/2024/10/Dash-of-Jazz-Nigerian-Zobo-Drink-15.jpg",
    },
    {
      name: "Chapman",
      slug: "chapman",
      description: "Classic Nigerian party drink — Fanta, Sprite, grenadine, cucumber, and ice.",
      price: 800,
      categoryId: drinks.id,
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80",
    },
    {
      name: "Fresh Watermelon Juice",
      slug: "watermelon-juice",
      description: "100% fresh blended watermelon. Cold and refreshing.",
      price: 700,
      categoryId: drinks.id,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: { image: item.image },
      create: item,
    });
  }

  console.log(`✅ ${menuItems.length} menu items created`);
  console.log("\n🎉 Seed complete!");
  console.log("   Admin login: admin@chopchop.ng / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });