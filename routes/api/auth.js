const express = require('express');
const router = express.Router();

// @route   GET api/auth/test
// @desc    Tests authorizations route
// @access  Public
router.get('/test', (req, res) => {
  const resposta = {
    usuario: 'allancac',
    email: 'allancac@gmail.com'

  };
  res.json(resposta);
});

module.exports = router;
