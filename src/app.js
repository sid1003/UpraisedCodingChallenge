require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const authenticateToken = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const ApiResponse = require('./utils/ApiResponse'); 

app.get('/', (req, res) => {
  const response = new ApiResponse(200, 
    {
    message: 'Welcome to the IMF Gadget API!',
    description: 'This API manages gadgets for the Impossible Missions Force.',
    endpoints: {
      gadgets: {
        getAllGadgets: 'GET /gadgets',
        addGadget: 'POST /gadgets',
        updateGadget: 'PATCH /gadgets/:id',
        decommissionGadget: 'DELETE /gadgets/:id',
        selfDestructGadget: 'POST /gadgets/:id/self-destruct',
      },
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
      },
    },
    note: 'Use Postman or cURL to interact with the API.',
  });

  res.status(response.statusCode).json(response);
});

const authRoutes = require('./routes/auth');
const gadgetRoutes = require('./routes/gadgets');

app.use('/auth', authRoutes);
app.use('/gadgets', authenticateToken, gadgetRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));