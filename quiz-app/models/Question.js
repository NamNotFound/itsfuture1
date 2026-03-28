const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: v => v.length === 4 },
  correct: { type: Number, required: true, min: 0, max: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
