const routes = require("express").Router();

const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/jwtKey");

routes.post("/login", async (req, res, next) => {
  const { email, password } = req.body.userData;

  const user = await User.findOne({ email });

  if (email === undefined || password === undefined) {
    res.status(401).json({
      success: false,
      code: "DD101_API_ERROR_01",
      message: "E-mail e/ou senha invalida",
    });
  } else if (user && bcrypt.compareSync(password, user.password)) {
    let tokenData = {
      name: user.name,
      email: user.email,
    };
    let generationToken = jwt.sign(tokenData, jwtConfig.JWT_KEY, {
      expiresIn: "1m",
    });
    return res.json({
      success: true,
      token: generationToken,
    });
  } else {
    res.status(401).json({
      success: false,
      code: "DD101_API_ERROR_01",
      message: "E-mail e/ou senha invalida",
    });
  }
});

routes.get("/verifytoken", (req, res, next) => {
  console.log(req.headers["authorization"]);
  let token = req.headers["authorization"];
  console.log(token);
  console.log(jwtConfig.JWT_KEY);
  jwt.verify(token, jwtConfig.JWT_KEY, (err, decode) => {
    if (!err) {
      res.json({
        success: true,
        message: "toke is valid",
      });
    } else {
      res.status(401).json({
        success: false,
        error: err,
      });
    }
  });
});
module.exports = routes;
