const express  = require('express'),
      passport = require('passport');

const router = express.Router();

//get login
router.get('/login', (req, res) => {
    res.render('login');
});

//post login
router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(req.session);
    
    res.redirect('/progress');
});

module.exports = router;