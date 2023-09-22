const express = require('express');
const cors = require('cors');
const app = express();

const { authenticate } = require('./middlewares/authMiddleware');
const getenv = require('./utils/helpers/getenv');
const stockPatternRoute = require('./routes/stockPatternRoute');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = getenv('MONGO_URI');

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => {
    console.error(`Can't connect to mongodb`);
    console.error(err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('stock-master-be');
});

app.get('/private', authenticate(), (req, res) => {
  console.log(req.auth.payload);
  res.send('private page');
});

app.post('/auth0/post-user-registration', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.use('/stock-patterns', stockPatternRoute);

app.listen(5000, () => console.log('stock-master-be started...'));
