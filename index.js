var express = require('express');
var passport = require('passport');
var config = require('./config/api.config.json');
var app = express();
var SpotifyStrategy = require('./node_modules/passport-spotify/lib/passport-spotify/index').Strategy;

var client_id = config.Spotify.client_id;
var client_secret = config.Spotify.client_secret ;
var str = 'nada';
var credentials = {};

app.use(passport.initialize());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8888/auth/spotify/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    credentials.accessToken = accessToken;
    credentials.refreshToken = refreshToken;
    credentials.profile = profile;
    // str = 'accessToken ' + accessToken + '\nrefreshToken ' + refreshToken + '\nprofile ' + profile;
    // console.log(str)
    return done(null, profile);
  }
));


app.get('/', function(req, res){
  res.send('hello world ');
});
app.get('/info', function(req, res){
  res.send(credentials);
});


app.get('/auth/spotify',
  passport.authenticate('spotify'),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/info');
  });

console.log('listening on port 8888');
app.listen(8888);
