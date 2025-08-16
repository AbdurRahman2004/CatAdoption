// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('../server/config/db.js'); // PostgreSQL setup
const connectCloudinary = require('../server/config/cloudinary.js')

const petRouter = require('./Routes/PetRoute');
const AdoptFormRoute = require('./Routes/AdoptFormRoute');
const AdminRoute = require('./Routes/AdminRoute');

const app = express();

app.use(cors({
  origin: ['https://pawpals-abdur.vercel.app/'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pets', petRouter)
app.use('/form', AdoptFormRoute);
app.use('/admin', AdminRoute);

app.get('/healthz', (req, res) => res.send('ok'));

// Start server after confirming PostgreSQL connection
 connectCloudinary()
  db.connect()
  .then(obj => {
    obj.done(); // release the connection
    console.log('Connected to PostgreSQL');
    const PORT =  process.env.PORT || 4000;;
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message || error);
  });
