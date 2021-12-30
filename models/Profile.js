const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProfileSchema = new Schema({
  /************************Referência ao Modelo "users" ********************/
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  tratamento: {
    type: String,
    required: true,
    max: 40
  },

  /*******************************Demais atributos profile**************************/
  //Local da Empresa
  empresa: {
    type: String
  },
  //WebSite da Empresa
  website: {
    type: String
  },
  //Local da Empresa
  localidade: {
    type: String
  },
  //Nivel do cargo: Junior, Pleno, Senior
  nivelCargo: {
    type: String,
    required: true
  },
  //Array com as habilidades Técnicas do usuário. Ex: Python, Java, SQL, Linux, ...
  habilidades: {
    type: [String],
    required: true
  },
  // Breve descrição sobre o usuário
  sobre: {
    type: String
  },
  //Link para o Perfil do GitHub do usuário
  github: {
    type: String
  },

  /************************Atributos sobre Experiências do profile********************/
  //Array com a experência(s) do perfil do usuário
  experiencias: [
    {
      // Cargo do usuário na experiência
      titulo: {
        type: String,
        required: true
      },
      //Nome da empresa da experiência
      nomeEmpresa: {
        type: String,
        required: true
      },
      //Cidade do Local da experiência
      local: {
        type: String
      },
      //Data de início da experiência
      desdeData: {
        type: Date,
        required: true
      },
      //Data do final  da experiência 
      ateData: {
        type: Date
      },
      //Se é a experiência atual
      atual: {
        type: Boolean,
        default: false
      },
      //Breve descrição da experiência
      descricao: {
        type: String
      }

    }
  ],

  /************************Atributos sobre Experiências do profile********************/
  //Array com a informações sobre educação do perfil do usuário
  educacao: [
    {
      // Nome da Instiruição
      instituicao: {
        type: String,
        required: true
      },
      // Grau do curso
      grau: {
        type: String,
        required: true
      },
      //Área de estudos do curso
      areaDeEstudo: {
        type: String,
        required: true
      },
      //Data de início do curso
      desdeData: {
        type: Date,
        required: true
      },
      //Data do final do curso 
      ateData: {
        type: Date
      },
      //Breve descrição do curso
      descricao: {
        type: String
      }

    }
  ],

  /************************Objeto com Atributos com links das mídias Sociais  do profile********************/
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    },
  },

  //Data de criação do perfil
  date: {
    type: Date,
    default: Date.now
  }

})

const Profile = mongoose.model('profiles', ProfileSchema)
module.exports = Profile