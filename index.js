var express = require('express');
var passport = require('passport');
var config = require('./config/api.config.json');
var app = express();
var SpotifyStrategy = require('./node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
/////////DB stuff
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/selfmusic');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("db connection");
});

var userSchema = mongoose.Schema({
    name: String,
    spotifyId: String,
    tokens: { type: mongoose.Schema.Types.Mixed, default: {} },
    ownerInfo: { type: mongoose.Schema.Types.Mixed, default: {} }
});
var User = mongoose.model('User', userSchema);

///////// end DB stuff

var client_id = config.Spotify.client_id;
var client_secret = config.Spotify.client_secret ;
var str = 'nada';
var credentials = {};

// app.use(passport.initialize());
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

passport.use(new SpotifyStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: "http://localhost:8888/auth/spotify/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    credentials.profile = profile;
    User.findOne({ spotifyId: profile.id }, function (err, user) {
      var newUser = new User({
        name: profile.displayName,
        spotifyId: profile.id,
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken
        },
        ownerInfo: profile
      });

      if(!user){
         newUser.save(function(err, newUser) {
            console.log('Success: Account added to database.');
            return done(null, newUser);
        });
      } else {
        return done(null, newUser);
      }
    });
  }
));


app.get('/', function(req, res){
  res.send('hello world ');
});
app.get('/info', function(req, res){
  res.send(credentials);
});


app.get('/auth/spotify',
  passport.authenticate('spotify', { session: false, scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-modify-private'] }),
  function(req, res){
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { session: false, failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('selfmusic-login://');
  });

console.log('listening on port 8888');
app.listen(8888);
