const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET /questions — for users (no correct answer exposed)
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({}, { correct: 0, __v: 0 }).lean();
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /questions/with-answers — for grading (send answers from client to check)
router.post('/check-answers', async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: selectedIndex }
    const ids = Object.keys(answers);
    const questions = await Question.find({ _id: { $in: ids } }).lean();

    let score = 0;
    const results = questions.map(q => {
      const selected = answers[q._id.toString()];
      const isCorrect = selected === q.correct;
      if (isCorrect) score++;
      return { id: q._id, correct: q.correct, selected, isCorrect };
    });

    res.json({ score, total: questions.length, results });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/questions — admin add question
router.post('/admin/questions', authMiddleware, async (req, res) => {
  try {
    const { question, options, correct } = req.body;
    if (!question || !options || options.length !== 4 || correct === undefined)
      return res.status(400).json({ error: 'Invalid question data' });

    const q = await Question.create({ question, options, correct: Number(correct) });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /admin/questions — admin list all questions
router.get('/admin/questions', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().lean();
    res.json(questions);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/questions/:id
router.delete('/admin/questions/:id', authMiddleware, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
