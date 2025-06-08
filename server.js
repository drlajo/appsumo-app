const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/appvotes';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const voteSchema = new mongoose.Schema({
  app: { type: String, unique: true },
  score: { type: Number, default: 0 },
});

const Vote = mongoose.model('Vote', voteSchema);

// Serve static files (index.html, script.js, etc)
app.use(express.static(path.join(__dirname)));

// Get all vote scores
app.get('/votes', async (req, res) => {
  try {
    const docs = await Vote.find();
    res.json(docs.map(d => ({ app: d.app, score: d.score })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cast a vote
app.post('/vote', async (req, res) => {
  const { app: appName, vote } = req.body;
  if (typeof appName !== 'string' || typeof vote !== 'number') {
    return res.status(400).json({ error: 'Invalid request' });
  }
  try {
    let doc = await Vote.findOne({ app: appName });
    if (!doc) {
      doc = new Vote({ app: appName, score: 0 });
    }
    doc.score += vote;
    await doc.save();
    res.json({ app: doc.app, score: doc.score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
