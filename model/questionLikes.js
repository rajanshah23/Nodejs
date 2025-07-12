module.exports = (sequelize, DataTypes) => {
  const QuestionLikes = sequelize.define('questionLikes', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'questionId'],
      },
    ],
    timestamps: true,
  });

  return QuestionLikes;
};
