const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');

dotenv.config();

const books = [
  {
    title: 'The Great Gatsby', author: 'F. Scott Fitzgerald',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set against the decadent excess of the Jazz Age. A timeless portrait of the American Dream and its hollowness.',
    price: 12.99, category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg',
    stock: 20, rating: 4.2, pages: 180, publisher: 'Scribner', publishedYear: 1925
  },
  {
    title: 'To Kill a Mockingbird', author: 'Harper Lee',
    description: 'Through the eyes of Scout Finch, we witness her father Atticus defend a Black man unjustly accused of a crime in Depression-era Alabama. A profound meditation on justice, morality, and growing up.',
    price: 14.99, category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg',
    stock: 15, rating: 4.8, pages: 336, publisher: 'J. B. Lippincott', publishedYear: 1960
  },
  {
    title: '1984', author: 'George Orwell',
    description: 'In a totalitarian future where Big Brother watches your every move, Winston Smith secretly rebels against the oppressive Party. Orwell\'s chilling masterpiece remains the definitive warning about authoritarianism.',
    price: 11.99, category: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71kxa2HdZkL._AC_UF1000,1000_QL80_.jpg',
    stock: 25, rating: 4.7, pages: 328, publisher: 'Secker & Warburg', publishedYear: 1949
  },
  {
    title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari',
    description: 'From the Stone Age to Silicon Valley, Harari explores how biology and history shaped humanity. A sweeping, provocative narrative about the species that conquered the world — and what comes next.',
    price: 18.99, category: 'History',
    coverImage: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
    stock: 30, rating: 4.6, pages: 443, publisher: 'Harper', publishedYear: 2011
  },
  {
    title: 'A Brief History of Time', author: 'Stephen Hawking',
    description: 'Hawking takes readers on an awe-inspiring journey through the cosmos — from the Big Bang to black holes, time travel, and the nature of the universe. Science writing at its most accessible and profound.',
    price: 15.99, category: 'Science',
    coverImage: 'https://m.media-amazon.com/images/I/A1xkFZX5k-L._AC_UF1000,1000_QL80_.jpg',
    stock: 18, rating: 4.5, pages: 212, publisher: 'Bantam Books', publishedYear: 1988
  },
  {
    title: 'Atomic Habits', author: 'James Clear',
    description: 'Clear reveals how tiny changes compound into remarkable results. With proven frameworks for building good habits and breaking bad ones, this is the most practical guide to self-improvement ever written.',
    price: 17.99, category: 'Self-Help',
    coverImage: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
    stock: 35, rating: 4.8, pages: 320, publisher: 'Avery', publishedYear: 2018
  },
  {
    title: 'The Hobbit', author: 'J.R.R. Tolkien',
    description: 'Bilbo Baggins, a comfort-loving hobbit, is swept into an epic quest with Gandalf and thirteen dwarves to reclaim the Lonely Mountain from the fearsome dragon Smaug. The adventure that started it all.',
    price: 13.99, category: 'Fantasy',
    coverImage: 'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg',
    stock: 28, rating: 4.7, pages: 310, publisher: 'Allen & Unwin', publishedYear: 1937
  },
  {
    title: 'Steve Jobs', author: 'Walter Isaacson',
    description: 'The definitive biography of Apple\'s co-founder, based on more than 40 interviews. A fascinating portrait of a visionary genius who was also notoriously difficult — and who changed the world six times over.',
    price: 19.99, category: 'Biography',
    coverImage: 'https://m.media-amazon.com/images/I/71m+A5GH8nL._AC_UF1000,1000_QL80_.jpg',
    stock: 16, rating: 4.4, pages: 656, publisher: 'Simon & Schuster', publishedYear: 2011
  },
  {
    title: 'Gone Girl', author: 'Gillian Flynn',
    description: 'On their fifth anniversary, Nick Dunne\'s wife Amy mysteriously vanishes. As the investigation unfolds, disturbing secrets emerge. A twisting, psychological thriller that will leave you breathless.',
    price: 13.99, category: 'Mystery',
    coverImage: 'https://m.media-amazon.com/images/I/41rP9WQVU-L._AC_UF1000,1000_QL80_.jpg',
    stock: 20, rating: 4.0, pages: 422, publisher: 'Crown Publishers', publishedYear: 2012
  },
  {
    title: 'Clean Code', author: 'Robert C. Martin',
    description: 'Uncle Bob presents the best practices and principles for writing clean, readable, and maintainable code. Essential reading for every professional software developer who takes their craft seriously.',
    price: 22.99, category: 'Technology',
    coverImage: 'https://m.media-amazon.com/images/I/41xShlnTZTL._AC_UF1000,1000_QL80_.jpg',
    stock: 12, rating: 4.6, pages: 464, publisher: 'Prentice Hall', publishedYear: 2008
  },
  {
    title: 'Pride and Prejudice', author: 'Jane Austen',
    description: 'The witty, spirited Elizabeth Bennet navigates love and society as Mr. Darcy overcomes his pride. Austen\'s sharp social commentary and timeless romance make this one of the greatest novels ever written.',
    price: 9.99, category: 'Romance',
    coverImage: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
    stock: 24, rating: 4.5, pages: 432, publisher: 'T. Egerton', publishedYear: 1813
  },
  {
    title: 'The Lean Startup', author: 'Eric Ries',
    description: 'Ries introduces a methodology for developing businesses that relies on validated learning, rapid experimentation, and iterative product releases. The essential playbook for modern entrepreneurs.',
    price: 16.99, category: 'Technology',
    coverImage: 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg',
    stock: 22, rating: 4.3, pages: 336, publisher: 'Crown Business', publishedYear: 2011
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Book.deleteMany({});
    await User.deleteMany({});

    await Book.insertMany(books);
    console.log(`✅ Seeded ${books.length} books`);

    await User.create({ name: 'Admin User',  email: 'admin@bookstore.com', password: 'admin123',    role: 'admin' });
    await User.create({ name: 'John Doe',    email: 'john@example.com',    password: 'password123', role: 'user'  });
    console.log('✅ Seeded demo users');
    console.log('');
    console.log('─────────────────────────────────────');
    console.log('  Demo Credentials:');
    console.log('  👤 User  → john@example.com / password123');
    console.log('  🛡️ Admin → admin@bookstore.com / admin123');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDB();
