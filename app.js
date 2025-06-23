const express = require("express");
const { users } = require("./model/index");
const app = express();

// We can also do like this
// const app=require("express")()

require("./model/index");
const PORT = 3000;


app.use(express.urlencoded({ extended: true })); //for server sid erendering use this
app.use(express.json()); ///client side rendering huds yo use garni(react,vue.....)



//templaing engine(Backend batai frontend render garna we use either(ejs,pug,handlebar,moustache))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("auth/register");
});

app.post("/register", async(req, res) => {
  //destructuring 
  // const username=req.body.username// const email=req.body.email// const password=req.body.password
  //or 
  const {username,email,password}=req.body
  await users.create({
  email ,
  username ,
  password

 })
res.send("Registered Successfully")
});




app.get("/login", (req, res) => {
 res.render("auth/login")
});

app.post("/login", async(req, res) => {
const {email,password}=req.body
await users.findOne({
  email,password
})
res.send ("Login Successfully")
});


















app.use(express.static("public/css/"));

app.listen(PORT, () => {
  console.log(`Server has startd at http://localhost:${PORT}`);
});



//rest api
//reister-post






//resful api
