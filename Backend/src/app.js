const express = require('express')
const multer = require('multer');
const cors = require('cors');
const authRoutes = require('./routes/users.routes')
const postRoutes = require('./routes/post.routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;