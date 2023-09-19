const express = require('express');
const cors = require('cors');
const app = express();

const { authenticate } = require('./middlewares/authMiddleware');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('stock-master-be');
});

app.get('/private', authenticate(), (req, res) => {
  res.send('private page');
});

app.post('/auth0/post-user-registration', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(5000, () => console.log('stock-master-be started...'));
