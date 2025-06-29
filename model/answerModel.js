module.exports = (sequelize, DataTypes) => {
    const Answer= sequelize.define("answer", {
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
     
    });
    return Answer;
  };