const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require("bcrypt");
const bearerToken = require('express-bearer-token');
const Sequelize = require('sequelize');

const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '#da!k27_d(3-S7';

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next){
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);

const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bearerToken());
app.use((req, res, next)=>{
  res.setHeader('X-Powered-By', 'Ronaldo Freitas');
  next();
});


function verifyJWT(req, res, next) {
  //const token = req.headers.authorization 
  if (!req.token) return res.status(401).send({ auth: false, message: 'Falha na autenticação.', type:1 });
  jwt.verify(req.token, jwtOptions.secretOrKey, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Falha na autenticação.', type:2 });
    
    // revisar: 
    req.userId = decoded.id;
    next();
  });
}

/* 
* conexão com o banco 
* revisar: organizar estrutura e deixar em arquivo separado
 -------------------------------------------------------------------------
*/
const sequelizeOptions = {
  database: 'mysql_node_3',
  username: 'root',
  password: '123',
  dialect: 'mysql',
  logging: false
};
const sequelize = new Sequelize(sequelizeOptions);

sequelize
  .authenticate()
  .then(() => console.log(`Conexão estabelecida - ${sequelizeOptions.dialect}`))
  .catch(err => console.error('Não é possível conectar ao banco:', err));
// -------------------------------------------------------------------------

/* Model Usuario */
const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    isEmail: true,
    required: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    required: true
  }
});
/* encriptar senha usuário */
User.beforeCreate((user, options) => {
  return bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash;
  })
  .catch(err => {
    throw new Error(); 
  });
});
/* validar senha usuário */
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

/*
* criar tabela usuário
User.sync()
  .then(() => console.log('Tabela de usuário criada com sucesso'))
  .catch(err => console.log('Não foi possível realizar essa tarefa'));
*/

const createUser = async ({ email, name, password }) => {
  try {
    await User.create({ email, name, password }).then( (user) => {
      return user;
    });
  } catch(e) {
    return {erro:1};
  }
};
const getUser = async obj => {
  try {
    return await User.findOne({
      where: {
        email:obj.email
      },
    });
  } catch(e) {
    return {erro:1};
  }
};

/* Model Cidades */
const Cities = sequelize.define('cities', {
  name: {
    type: Sequelize.STRING,
  },
  },{timestamps: false}
);
const getAllCities = async () => {
  try {
    return await Cities.findAll();
  } catch(e) {
    return {erro:1};
  }
};

// ----------ROTAS--------------

app.get('/', function(req, res) {
  res.json({ message: 'Api Rest!' });
});

app.post('/cadastrar', function(req, res, next) {
  const { email, name, password } = req.body;
  createUser({ email, name, password }).then( (user) =>{
    if (typeof user === undefined) {
      res.json({ user:null, msg: 'não foi possível cadastrar', erro:1 })
    } else {
      res.json({ user, msg: 'account created successfully' })
    }
  });
});

app.post('/autenticar', async function(req, res, next) {
  const { email, password } = req.body;
  if (email && password) {
    await User.findOne({ where: { email: email } }).then( function (user) {
      if (!user) {
        res.status(401).json({ message: 'No such user found' });
      } else {
        user.validPassword(password).then(vald => {
          if (vald === true) {
            let payload = {
              id: user.dataValues.id, 
              name: user.dataValues.name, 
              //exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hora
              exp: Math.floor(Date.now() / 1000) + (60 * 1), // 1 minuto
            };
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ msg: 'ok', user:user,token: token });
          } else {
            res.status(401).json({ msg: 'Password is incorrect' });
          }
        });
      }
    });
  } else {
    res.status(401).json({ msg: 'Input data required' });
  }
});

/*
* testando rota com passport jwt
app.get('/teste-passport', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('ok.');
});
*/

app.get('/cities', verifyJWT, (req, res) => {
  getAllCities().then( (city) =>{
    if (typeof city === undefined) {
      res.json({ city:null, msg: 'não foi possível cadastrar', erro:1 })
    } else {
      res.json({ result:city })
    }
  });
});


// start app
app.listen(4000, function() {
  console.log('API ok - porta 4000');
});
