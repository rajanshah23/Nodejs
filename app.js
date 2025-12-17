const express = require("express");
const app = express();
const methodOverride = require('method-override');
const { renderHomePage } = require("./controllers/authController");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
const socketio = require("socket.io");
app.use(express.urlencoded({ extended: true })); // for server side rendering use this
app.use(express.json()); // client side rendering huda yo use garni(react,vue.....)
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(methodOverride('_method'));
require("./model/index");
const authRoute = require("./routes/authRoute");
const questionRoute = require("./routes/questionRoute");
const answerRoute = require("./routes/answerRoute");
const catchError = require("./utils/catchError");
const { answers, sequelize } = require("./model/index");
const { isAuthenticated } = require("./middleware/isAuthenticated");
const { QueryTypes } = require("sequelize");

// mailey navbar ma user login xa van logout dekhauna paryo ane viceversa
app.use(async (req, res, next) => {
  const token = req.cookies.jwtToken;
  try {
    const verifiedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (verifiedResult) {
      res.locals.isAuthenticated = true; // locals is  a global variable which is used to store the key value
       res.locals.userId = verifiedResult.id;
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
app.get("/",renderHomePage);
app.use("/", authRoute);
app.use("/", questionRoute);
app.use("/answer", answerRoute);

app.use(express.static("./storage"));
app.use(express.static("public/css/"));

const server = app.listen(PORT, () => {
  console.log(`Server has startd at http://localhost:${PORT}`);
});

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("like", async ({ answerId, cookie }) => {
        try {
    const answer = await answers.findByPk(answerId);
    if (answer && cookie) {
      const decryptedResult = await promisify(jwt.verify)(cookie, process.env.JWT_SECRET);
      if (decryptedResult) {
        const user = await sequelize.query(
          `SELECT * FROM likes_${answerId} WHERE userId=${decryptedResult.id}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (user.length === 0) {
          await sequelize.query(
            `INSERT INTO likes_${answerId} (userId) VALUES(${decryptedResult.id})`,
            {
              type: QueryTypes.INSERT,
            }
          );
        }
      }
      const likes = await sequelize.query(`SELECT * FROM likes_${answerId}`, {
        type: QueryTypes.SELECT,
      });

      const likesCount = likes.length;
      await answers.update(
        {
          likes: likesCount,
        },
        {
          where: {
            id: answerId,
          },
        }
      );
      console.log(likesCount);
      socket.emit("likeUpdate", { likesCount, answerId });
    }
    } catch (err) {
      console.error(err);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});