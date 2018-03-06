const SERVER_PORT = process.env.PORT || 3000;

const express  							= require('express'),
			app      							= express(),
			ejs      							= require('ejs'),
			passport 							= require('passport'),
			bodyParser 						= require('body-parser'),
			User									= require('./models/user'),
			LocalStrategy 				= require('passport-local'),
			crypto 								= require('crypto'),
			sqlite3 							= require('sqlite3');

const db = new sqlite3.Database('./database.sqlite3');

// configure user session
app.use(require('express-session')({
	secret: 'any rando, string',
	resave: false,
	saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//=================================//
//=================================//
// NEED TO CHECK
//=================================//
//=================================//

const hashPassword = (password, salt) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new LocalStrategy((username, password, done) => {
  db.get('SELECT salt FROM users WHERE username = ?', username, (err, row) => {
    if (!row) return done(null, false);
    const hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, (err, row) => {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT id, username FROM users WHERE id = ?', id, (err, row) => {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

// ...

app.post('/login', passport.authenticate('local', { 
	successRedirect: '/good-login',
  failureRedirect: '/bad-login' 
}));

//=================================//
//=================================//
// NEED TO CHECK
//=================================//
//=================================//

app.listen(SERVER_PORT, () => { // Set app to listen for requests on port 3000
  console.log('Listening on port 8080!'); // Output message to indicate server is listening
});