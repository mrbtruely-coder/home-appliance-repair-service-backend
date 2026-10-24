const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/booking', bookingRoutes);

// Health checks
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Doorstep Services Hyderabad Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Doorstep Services Hyderabad Backend API',
    locations: ['Ameerpet Main Road', 'Chanda Nagar', 'Alwal', 'Suchitra'],
    helpline: '9515661677',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Doorstep Backend API Server running on port ${PORT}`);
});
