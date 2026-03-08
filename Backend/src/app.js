const express = require('express')
const multer = require('multer');
const cors = require('cors');
const authRoutes = require('./routes/users.routes')

const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes)

module.exports = app;