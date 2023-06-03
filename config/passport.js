
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const calendar = google.calendar('v3');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
    scope: ["email", "profile", "https://www.googleapis.com/auth/calendar"]
  },
  function (accessToken, refreshToken, profile, cb) {
      // console.log(profile, accessToken, refreshToken);
      // create OAuth2 client with appropriate scopes
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CALLBACK_URL
);
oAuth2Client.setCredentials({
  access_token: accessToken,
  refresh_token: refreshToken,
});

// retrieve calendar data
calendar.events.list({
  auth: oAuth2Client,
  calendarId: 'primary',
  timeMin: new Date().toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: 'startTime',
}, (err, res) => {
  if (err) return console.log('The API returned an error: ' + err);
  const events = res.data.items;
  // console.log(res.data);
  if (events.length) {
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });
  } else {
    console.log('No upcoming events found.');
  }
});
    return cb(null, profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



passport.serializeUser( (user, done) => {
  done(null, user.id);
})

passport.deserializeUser((user, done) => {
    return done(null, user);
    User.findById(id).then((user) => {
        done(null, user);
    })
})
    
module.exports = passport;
