const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const { authenticate } = require('./middlewares/authMiddleware');
const getenv = require('./utils/helpers/getenv');
const stockPatternRoute = require('./routes/stockPatternRoute');
const auth0Route = require('./routes/auth0Route');
const questionRoute = require('./routes/questionRoute');
const gameRoute = require('./routes/gameRoute');
const leaderBoardRoute = require('./routes/leaderBoardRoute');

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

app.use('/stock-patterns', stockPatternRoute);
app.use('/auth0', auth0Route);
app.use('/questions', questionRoute);
app.use('/games', gameRoute);
app.use('/leaderboards', leaderBoardRoute);

app.listen(5000, () => console.log('stockmaster-be started...'));
