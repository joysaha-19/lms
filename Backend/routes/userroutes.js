const express = require("express");
const router = express.Router();
const {
  register,
  login,
  current,
  logout,
} = require("../controllers/usercontroller");
const validatetoken = require("../middleware/accesstokenhandler2");

router.post("/register", register);

router.post("/login", login);

router.get("/current", validatetoken, current);

router.post("/logout", validatetoken, logout);


module.exports = router;