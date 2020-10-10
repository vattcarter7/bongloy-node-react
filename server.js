const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const bongloy = new Stripe(process.env.BONGLOY_SECRET_KEY, {
  host: 'api.bongloy.com'
});

const app = express();

app.use(cors());
app.use(express.json());

app.post('/charge', async (req, res) => {
  try {
    await bongloy.charges.create({
      amount: 1900,
      currency: 'usd',
      source: req.body.id
    });

    res.status(200).json({
      success: true
    });
  } catch (err) {
    res.send(err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is running on port ' + port));
