const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  author:        { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  category: {
    type: String, required: true,
    enum: ['Fiction','Non-Fiction','Science','History','Biography','Technology','Self-Help','Mystery','Fantasy','Romance']
  },
  coverImage:    { type: String, default: '' },
  stock:         { type: Number, default: 10, min: 0 },
  rating:        { type: Number, default: 4.0, min: 0, max: 5 },
  pages:         { type: Number, default: 0 },
  publisher:     { type: String, default: '' },
  publishedYear: { type: Number }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);
