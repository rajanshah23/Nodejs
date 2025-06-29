const { questions ,users,answers} = require("../model")


exports.renderAskQuestion=(req,res)=>{
res.render("questions/askQuestion")
}


exports.askQuestion=async(req,res)=>{
const {title,description}=req.body
console.log(req.body)
console.log(req.file.filename)
const userId=req.userId
const filename = req.file.filename
if(!title || !description){
    return res.send("Please provide title and description")
}
await questions.create({
    title,
    description,
    image:filename,
    userId,
})
res.redirect("/")
}


exports.getAllQuestion=async(req,res)=>{
    const data=await questions.findAll({
        include:[{
            model:users
        }]
    })
}
exports.renderSingleQuestionPage=async(req,res)=>{
    const{id}=req.params
     const data = await questions.findAll({
    //return array
    where:{
        id:id
    },
    include: {
      model: users,
      attributes: ["username"],
    },
  });

   const answersData = await answers.findAll({
        where : {
            questionId : id 
        }, 
        include : [{
            model : users, 
            attributes : ['username']
        }]
    })
  res.render("./questions/singleQuestion", { data, answers: answersData });
}