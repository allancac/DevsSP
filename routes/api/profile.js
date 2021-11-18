const express = require('express');
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profiles route
// @access  Public
router.get('/test', (req, res) => {
  const resposta = {
    nome: 'Allan Cezar Almeida Chaves',
    idade: 39,
    cidade: 'São Paulo',
    profissao: 'Desenvolvedor',
    nivelCarreira: 'junior',
    stack: 'MERN'

  };
  res.json(resposta);
});

module.exports = router;