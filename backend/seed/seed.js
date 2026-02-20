const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    title: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    description: 'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and crystal-clear audio. Perfect for commuters and audiophiles.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    stock: 50,
    rating: 4.8,
    seller: 'TechStore'
  },
  {
    title: 'Running Shoes Pro',
    price: 129.99,
    description: 'Lightweight performance running shoes with advanced cushioning technology and breathable mesh upper. Ideal for marathon runners.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports',
    stock: 100,
    rating: 4.6,
    seller: 'SportZone'
  },
  {
    title: 'The Art of Clean Code',
    price: 34.99,
    description: 'A comprehensive guide to writing readable, maintainable code. Covers principles, patterns, and best practices every developer should know.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    category: 'Books',
    stock: 200,
    rating: 4.9,
    seller: 'BookHub'
  },
  {
    title: 'Smart Watch Series X',
    price: 449.99,
    description: 'Advanced smartwatch with health monitoring, GPS, AMOLED display, and 7-day battery. Tracks your fitness, sleep, and notifications.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    seller: 'TechStore'
  },
  {
    title: 'Minimalist Leather Wallet',
    price: 49.99,
    description: 'Slim RFID-blocking genuine leather wallet. Holds up to 12 cards and cash. Handcrafted with premium Italian leather.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    category: 'Clothing',
    stock: 150,
    rating: 4.5,
    seller: 'LeatherCraft'
  },
  {
    title: 'Bamboo Desk Organizer Set',
    price: 39.99,
    description: 'Eco-friendly bamboo desk organizer with 6 compartments. Keep your workspace tidy with this sustainable and beautiful set.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    category: 'Home',
    stock: 80,
    rating: 4.4,
    seller: 'EcoHome'
  },
  {
    title: 'Mechanical Keyboard TKL',
    price: 159.99,
    description: 'Tenkeyless mechanical keyboard with Cherry MX switches, RGB backlighting, and PBT double-shot keycaps. Built for productivity and gaming.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
    category: 'Electronics',
    stock: 45,
    rating: 4.8,
    seller: 'TechStore'
  },
  {
    title: 'Yoga Mat Premium',
    price: 79.99,
    description: 'Extra-thick 6mm non-slip yoga mat with alignment lines. Made from eco-friendly TPE material with carrying strap.',
    image: 'https://images.unsplash.com/photo-1601925228096-17a3f4fc7e94?w=400',
    category: 'Sports',
    stock: 120,
    rating: 4.6,
    seller: 'FitLife'
  },
  {
    title: 'Ceramic Pour-Over Coffee Set',
    price: 64.99,
    description: 'Hand-thrown ceramic pour-over dripper with matching mug. Brews a perfect single cup of coffee with exceptional flavor clarity.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    category: 'Home',
    stock: 60,
    rating: 4.7,
    seller: 'HomeGoods'
  },
  {
    title: 'Vintage Denim Jacket',
    price: 89.99,
    description: 'Classic unisex denim jacket with a worn-in look. Features button closure, chest pockets, and comfortable regular fit. A wardrobe staple.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'Clothing',
    stock: 75,
    rating: 4.5,
    seller: 'UrbanWear'
  }
];

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@test.com',
    password: 'password123'
  },
  {
    name: 'Bob Smith',
    email: 'bob@test.com',
    password: 'password123'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/micro_marketplace');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${createdProducts.length} products`);

    // Seed users (with some favorites)
    for (const userData of users) {
     await User.create({
      ...userData,
      favorites: [createdProducts[0]._id, createdProducts[2]._id]
     });
    }
    console.log(`✅ Seeded ${users.length} users`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: alice@test.com  | Password: password123');
    console.log('   Email: bob@test.com    | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDB();