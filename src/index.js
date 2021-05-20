require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const posts = require("./routes/posts");
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // lib para mostrar no log
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
); //libera o acesso para esse caminho
app.use("/posts", posts);
app.use("/auth", auth);
app.use("/users", users);
app.use(function (req, res, next) {
  res.header("Access-Controll-Allow-Origin", "*");
  res.header(
    "Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Authentication"
  );
  next();
});
app.listen(3000);
