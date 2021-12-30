const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Carregar o modelo Users e Profiles
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const erros = {};  //objeto para retorno de erros
  //Achar e retornar o perfil atual
  Profile.findOne({ user: req.user.id })
    .then(perfil => {
      if (!perfil) {
        erros.profile = 'Perfil não encontrado';
        return res.send(404).json(erros)
      } else {
        res.send(perfil);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile
// @desc    Create or edit User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Dados do perfil
  fieldsA = ["tratamento", "empresa", "website", "localidade", "nivelCargo", "sobre", "github"]
  const profileFields = {};
  profileFields.user = req.user.id
  fieldsA.forEach(element => { (req.body[element]) ? profileFields[element] = req.body[element] : "" })
  //Habilidades 
  if (typeof req.body.habilidades !== 'undefined') {
    profileFields.habilidades = req.body.habilidades.split(',')
  }
  //Redes sociais 
  fieldsB = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
  const socialFields = {};
  fieldsB.forEach(element => { (req.body[element]) ? socialFields[element] = req.body[element] : "" })



});

module.exports = router;