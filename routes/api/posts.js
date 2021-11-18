const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => {
  const resposta = {
    Comentario: 'MERN é uma das pilhas de tecnologia mais usadas no mercado de trabalho.',
    curtidas: 23

  };
  res.json(resposta);
});

module.exports = router;