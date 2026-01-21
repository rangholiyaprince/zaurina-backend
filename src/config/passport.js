const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');
const { generateToken } = require('../utils/token');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (!user) {
        // Register new user
        user = await User.create({
          first_name: profile.name.givenName || 'User',
          last_name: profile.name.familyName || 'Name',
          email: profile.emails[0].value,
          googleId: profile.id,
          provider: 'google',
          password: 'google_auth_placeholder', // Random or placeholder since password is required
          is_verified: true,
          is_active: true
        });
      } else {
        // Link account if email exists but no googleId
        if (!user.googleId) {
          user.googleId = profile.id;
          user.provider = 'google'; // Or 'local+google' if you support linking
          user.is_verified = true;
          await user.save();
        }
      }

      return cb(null, user);

    } catch (err) {
      return cb(err, null);
    }
  }
));

module.exports = passport;
