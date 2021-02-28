const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes 
const authRoute = require('./routes/auth');
const referralRoute = require('./routes/referral');


dotenv.config();

// Connect to DB 
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to DB'));

// MiddleWare
app.use(express.json());

// Route MiddleWare
app.use('/api/user', authRoute);   
app.use('/api/referral', referralRoute); 


app.listen(3000, () => console.log('Server up and listening'));