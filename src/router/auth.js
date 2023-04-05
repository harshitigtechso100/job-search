const express = require('express')
const router = express.Router()
const passport = require('passport')



router.get('/google', (req, res, next) => {
      req.session.google_oauth2_state = Math.random().toString(36).substring(2);
      next();
    },
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      prompt: 'select_account',
      state: true,
    })
)
router.get('/facebook', (req, res, next) => {
    req.session.Session = Math.random().toString(36).substring(2);
    next();
  },
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  })
  
)

router.get( '/callback',      
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/'
}))
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/',
}))

module.exports= router