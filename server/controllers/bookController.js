const Book = require('../models/Book');

// GET /api/books?search=&category=&page=&limit=
const getBooks = async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 12 } = req.query;
    const query = {};

    if (search.trim()) {
      query.$or = [
        { title:    { $regex: search.trim(), $options: 'i' } },
        { author:   { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Book.countDocuments(query);
    const books = await Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books/:id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/books  (admin)
const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/books/:id  (admin)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/books/:id  (admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
