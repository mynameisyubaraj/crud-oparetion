const express = require('express');
const app = express();
const port = 5000;
const fs = require('fs');

let users = require('./MOCK_DATA.json');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- SHOW ALL USERS ---------- */
app.get('/', (req, res) => {
  res.render('index', { users });
});

/* ---------- SEARCH USER BY ID ---------- */
app.get('/search', (req, res) => {
  const id = Number(req.query.id);
  const user = users.find(u => u.id === id);
  res.render('index', { users: user ? [user] : [] });
});

/* ---------- ADD USER PAGE ---------- */
app.get('/add', (req, res) => {
  res.render('add');
});

/* ---------- CREATE USER ---------- */
app.post('/users', (req, res) => {
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  const newUser = {
    id: newId,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    gender: req.body.gender
  };

  users.push(newUser);
  fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));
  res.redirect('/');
});

/* ---------- EDIT PAGE ---------- */
app.get('/edit/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) return res.redirect('/');

  res.render('edit', { user });
});

/* ---------- UPDATE USER ---------- */
app.post('/update/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (user) {
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.gender = req.body.gender;
  }

  fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));
  res.redirect('/');
});

/* ---------- DELETE USER ---------- */
app.get('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);

  fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));
  res.redirect('/');
});

app.listen(port, () => {
  console.log('Server running on port 5000');
});