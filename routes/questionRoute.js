const { renderAskQuestion, askQuestion,  renderSingleQuestionPage } = require("../controllers/questionController")
const { isAuthenticated } = require("../middleware/IsAuthenticated")

const router=require("express").Router()
const {multer,storage}=require("../middleware/multerConfig")
const upload= multer({storage:storage})


router.route('/askquestion').get(isAuthenticated,renderAskQuestion).post(isAuthenticated,upload.single('image'),askQuestion)
router.route('/question/:id').get(renderSingleQuestionPage)


module.exports=router