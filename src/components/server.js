// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/youtube_clone', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  isSubscriberOnly: Boolean,
});

const Video = mongoose.model('Video', videoSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  subscribedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.json({ message: 'User registered successfully.' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
};

app.post('/createVideo', authenticateUser, async (req, res) => {
  const { title, description, isSubscriberOnly } = req.body;
  const video = new Video({ title, description, isSubscriberOnly });
  await video.save();

  res.json({ message: 'Video created successfully.' });
});

app.get('/videos', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

app.post('/subscribe/:videoId', authenticateUser, async (req, res) => {
  const { videoId } = req.params;
  const user = await User.findById(req.userId);

  if (!user.subscribedVideos.includes(videoId)) {
    user.subscribedVideos.push(videoId);
    await user.save();
  }

  res.json({ message: 'Subscribed successfully.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
