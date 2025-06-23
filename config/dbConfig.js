module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "Nodejs",
    dialect: "mysql",  //kun database use garni ho
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };