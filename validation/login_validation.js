const Validator = require('validator');

const loginValidation = (body) => {
  const erros = {}

  body.email === null ? body.email : "";
  body.senha === null ? body.senha : "";


  // Validação do input email
  if (!Validator.isEmail(body.email)) {
    erros.email = 'O e-mail fornecido não é válido';
  }

  // Validação do input 1 da senha - 6 a 20 carateres
  if (!Validator.isLength(body.senha, { min: 8, max: 12 })) {
    erros.senha = 'A senha do usuário deve conter entre 8 e 12 caracteres.';
  }
  // Validação do input da senha - 6 a 20 carateres
  if (Validator.isEmpty(body.senha)) {
    erros.senha = 'Digite a senha do usuário.';
  }

  const resultado = {
    erros: erros
  }
  resultado.isValid = Object.keys(resultado.erros).length === 0;

  return resultado;
}

module.exports = loginValidation;