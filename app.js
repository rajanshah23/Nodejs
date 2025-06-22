const express = require("express");
const app = express();

// We can also do like this
// const app=require("express")()

const PORT = 3000;
app.use(express.json());

//templaing engine(Backend batai frontend render garna we use either(ejs,pug,handlebar,moustache))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("auth/register")
});

app.get("/login", (req, res) => {
  res.render("auth/login")
});


app.use(express.static("public/css/"))


app.listen(PORT, () => {
  console.log(`Server has startd at http://localhost:${PORT}`);
});
