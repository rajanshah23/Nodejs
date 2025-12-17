
const { QueryTypes } = require("sequelize")
const { answers, sequelize } = require("../model")


exports.handleAnswer = async(req,res)=>{
    const userId = req.userId 
    const {answer} = req.body 
    const {id:questionId} = req.params 
   const data =  await answers.create({
        answerText : answer, 
        userId, 
        questionId,
    })
    console.log(data)
    await sequelize.query(`CREATE TABLE likes_${data.id} (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) `,{
        type : QueryTypes.CREATE
    })
    
    res.redirect(`/question/${questionId}`)
}

exports.deleteAnswer = async (req, res) => {
  try {
    const { id: answerId, questionId } = req.params;

    // Delete the answer
    await answers.destroy({ where: { id: answerId } });

    // Optional: you can also drop likes table if you created one per answer
    await sequelize.query(`DROP TABLE IF EXISTS likes_${answerId}`);

    res.redirect(`/question/${questionId}`);  
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting answer");
  }
};
