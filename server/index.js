const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const { getCart, addToCart } = require('./controllers/cartCtrl');

const port = 3001;

const app = express();

//MIDDLEWARES - transform or interact with the request before the endpoint is hit.

//TOP LEVEL MIDDLEWARES: app.use()
app.use(json());
app.use(cors());

//session - JUST AN OBJECT that you can use to store temporary information (cart, user information).
// sessions are based on the singular browser that is being used, so this information being stored is personal to that browser.
app.use(
  session({
    secret: 'Super Duper Secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.use((req, res, next) => {
  console.log('req.body: ', req.body);
  console.log('req.session: ', req.session);
  console.log('req.query: ', req.query);
  console.log('req.params: ', req.params);
  next();
});

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

//this will be used as request-level middleware
//If you wanted to check for every endpoint if a user was logged in, then
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    res.redirect('http://localhost:3000/login');
  }
};

app.get('/api/cart', getCart);

//example use for request-level middleware
//comment this next line out.
app.get('/api/cart', isLoggedIn, getCart);

app.post('/api/cart', addToCart);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
