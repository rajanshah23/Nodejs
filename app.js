const express = require("express");
const app = express();
const { renderHomePage } = require("./controllers/authController");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const session = require("express-session");
const flash=require('connect-flash')

app.use(express.urlencoded({ extended: true })); // for server side rendering use this
app.use(express.json()); // client side rendering huda yo use garni(react,vue.....)
app.use(cookieParser());
app.use(
  session({
    secret: "This is secret for the session",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash())



require("./model/index");
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");
const { isAuthenticated } = require("./middleware/IsAuthenticated");
const catchError = require("./utils/catchError");

// mailey navbar ma user login xa van logout dekhauna paryo ane viceversa
app.use(async (req, res, next) => {
  const token = req.cookies.jwtToken;
  try {
    const verifiedResult = await promisify(jwt.verify)(token, "hahaha");
    if (isAuthenticated) {
      res.locals.isAuthenticated = true; // locals is  a global variable which is used to store the key value
    } else {
      res.locals.isAuthenticated = false;
    }
  } catch (error) {
    res.locals.isAuthenticated = false;
  }
  next();
});

// templaing engine (Backend batai frontend render garna we use either(ejs,pug,handlebar,moustache))
app.set("view engine", "ejs");
app.get("/",catchError(renderHomePage));
app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/answer", answerRoute);

app.use(express.static("./storage"));
app.use(express.static("public/css/"));

app.listen(PORT, () => {
  console.log(`Server has startd at http://localhost:${PORT}`);
});
