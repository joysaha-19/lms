const express = require("express");
const router = express.Router();
const {
  getcourse,
  getallcourses,
  getallusercourses,
  seecourse,
  enrollincourse,
  addcourse,
  deletepublishedcourse,
  deletedraftcourse,
  completeChapter
} = require("../controllers/coursecontroller");
const validatetoken = require("../middleware/accesstokenhandler2");
// Define your routes here, for example:
router.get("/spcourse",  getcourse);
router.get("/allcourses",  getallcourses);
router.get("/usercourses",  getallusercourses);
router.post("/enroll",  enrollincourse);
router.get("/seecourse",seecourse);
router.post("/addcourse", addcourse);
router.post("/deletepublishedcourse", deletepublishedcourse);
router.post("/deletedraftcourse", deletedraftcourse);
router.post("/completechapter", completeChapter);
module.exports = router;