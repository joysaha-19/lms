const express = require("express");
const router = express.Router();
const {
  getallcourses,
  getallusercourses,
  seecourse,
  enrollincourse,
  addcourse
} = require("../controllers/coursecontroller");
const validatetoken = require("../middleware/accesstokenhandler2");
// Define your routes here, for example:
router.get("/allcourses",  getallcourses);
router.get("/usercourses",  getallusercourses);
router.post("/enroll",  enrollincourse);
router.get("/seecourse",seecourse);
router.post("/addcourse", addcourse);
module.exports = router;