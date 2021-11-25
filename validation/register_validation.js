const Validator = require('validator');

const registerValidation = (body) => {
  const erros = {}

  body.nome === null ? body.nome : "";
  body.email === null ? body.email : "";
  body.senha === null ? body.senha : "";
  body.senha2 === null ? body.senha2 : "";

  // Validação do preenchimento para input nome - Input nome entre 2 e 30 caracteres
  if (!Validator.isLength(body.nome, { min: 2, max: 30 })) {
    erros.nome = 'O nome do usuário deve conter entre 2 e 30 caracteres.';

  }
  // Validação do preenchimento para input nome - Input nome não vazio
  if (Validator.isEmpty(body.nome)) {
    erros.nome = 'O nome do usuário deve ser preenchido';
  }

  // Validação do input email
  if (!Validator.isEmail(body.email)) {
    erros.email = 'O e-mail fornecido não é válido';
  }

  // Validação do input 2 da senha - Input senha vazio
  if (Validator.isEmpty(body.senha)) {
    erros.senha = 'Forneça uma senha';
  }

  // Validação do input 1 da senha - 6 a 20 carateres
  if (!Validator.isLength(body.senha, { min: 8, max: 12 })) {
    erros.senha = 'A senha do usuário deve conter entre 8 e 12 caracteres.';
  }
  // Validação do input 2 da senha - 6 a 20 carateres
  if (Validator.isEmpty(body.senha2)) {
    erros.senha = 'Confirme a senha.';
  }

  // Validação dos input senha - inputs de senha e confirmação são iguais
  if (body.senha !== body.senha2) {
    erros.senha = 'A confirmação da senha é diferente da fornecida.';
  }

  const resultado = {
    erros: erros
  }
  resultado.isValid = Object.keys(resultado.erros).length === 0;

  return resultado;
}

module.exports = registerValidation;