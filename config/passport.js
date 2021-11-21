const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const keys = require('../config/keys');

// Objeto contendo as opções utilizadas na estratégia do JWT
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.appSecret;

//exporta uma arrow function que utiliza a estratégia do JWT
module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (payload, done) => {
    const idUser = payload.id
    User.findById(idUser, 'nome email')
      .then(usuario => {
        if (usuario) {
          return done(null, usuario);
        }
        return done(null, false);
      });

  }))
}