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
      code: "API_ERROR_01",
      message: "E-mail e/ou senha invalida",
    });
  } else if (user && bcrypt.compareSync(password, user.password)) {
    let tokenData = {
      name: user.name,
      email: user.email,
    };
    let generationToken = jwt.sign(tokenData, jwtConfig.JWT_KEY, {
      expiresIn: "60m",
    });
    return res.json({
      success: true,
      token: generationToken,
    });
  } else {
    console.log("aqui");
    res.status(401).json({
      success: false,
      code: "API_ERROR_01",
      message: "E-mail e/ou senha invalida",
    });
  }
});

routes.get("/verifyToken", (req, res, next) => {
  let token = req.headers["authorization"];
  jwt.verify(token, jwtConfig.JWT_KEY, (err, decode) => {
    if (!err) {
      res.json({
        success: true,
        message: "token is valid",
        data: decode,
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
