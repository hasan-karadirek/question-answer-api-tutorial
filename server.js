const express = require('express');
const path = require('path');

const dotenv = require('dotenv');

dotenv.config({
  path: './config/env/config.env',
});

const routers = require('./routers/index.js');

const app = express();

const PORT = process.env.PORT;
//Express - req.body Middleware
app.use(express.json());

//MangoDB Connection
const connectDatabase = require('./helpers/database/connectDatabase');
connectDatabase();

//CustomErrorHandler
const customErrorHandler = require('./middlewares/errors/customErrorHandler');

// Routers Middleware
app.use('/api', routers);

// Error Handler
//When we pass an error in next "next(new CustemError())" Our customErrorHandler will work.
app.use(customErrorHandler);

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Hello World PORT ${PORT}`);
});
