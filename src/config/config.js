module.exports = {
  "development": {
    "username": "b729146b881877",
    "password": "8b1d1c8b",
    "database": "heroku_2f1b59704635635",
    "host": "us-cdbr-iron-east-03.cleardb.net",
	"storage": "heroku_2f1b59704635635.sqlite",
    "dialect": "sqlite"
    // "dialect": "mysql"
  },
  "test": {
    "username": "b729146b881877",
    "password": "8b1d1c8b",
    "database": "heroku_2f1b59704635635",
    "host": "us-cdbr-iron-east-03.cleardb.net",
    "storage": "heroku_2f1b59704635635.sqlite",
    //  "dialect": "sqlite"
      "dialect": "mysql"
  },
  "production": {
    "host": "ec2-54-225-95-183.compute-1.amazonaws.com",
    "database": "dugfouar2nq21",
    "username": "mwiffgsanagrso",
    "port": "5432",
    "password": "8b1d1c8b",
    "uri": "postgres://mwiffgsanagrso:638cf6dc2b2bbda075d4fdbd13622bde64b7e96c1a2a8afd934b6e5fc29edafd@ec2-54-225-95-183.compute-1.amazonaws.com:5432/dugfouar2nq21",
      //"dialect": "sqlite"
    "dialect": "postgres"
  }
};
