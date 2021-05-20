const routes = require("express").Router();

const User = require("../models/users");
const config = require("../config/jwtKey");
const bcrypt = require("bcrypt");

routes.get("/list", async (req, res) => {
  const users = await User.find();

  return res.json(users);
});

routes.delete("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  await user.remove();

  return res.send();
});

routes.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body.userData;

  const hash = bcrypt.hashSync(password, config.SALT_ROUNDS);

  const handler = (err, result) => {
    if (!err) {
      res.json({
        success: true,
        message: "User registered",
        data: result,
      });
    } else {
      res.json({
        success: false,
        message: "User not registered",
        error: result,
      });
    }
  };
  const dataToInsert = await User.create({
    name,
    email,
    password: hash,
  })
    .then((result) => handler(false, result))
    .catch((result) => handler(true, result));

  return res.json(dataToInsert);
});

module.exports = routes;
