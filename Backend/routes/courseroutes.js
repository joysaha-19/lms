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
  completeChapter,
  editpublishedcourse
} = require("../controllers/coursecontroller");
const validatetoken = require("../middleware/accesstokenhandler2");
// Define your routes here, for example:
router.get("/spcourse", validatetoken, getcourse);
router.get("/allcourses",validatetoken,  getallcourses);
router.get("/usercourses",validatetoken,  getallusercourses);
router.post("/enroll", validatetoken, enrollincourse);
router.get("/seecourse",validatetoken,seecourse);
router.post("/addcourse", addcourse);
router.post("/deletepublishedcourse", validatetoken,deletepublishedcourse);
router.post("/editpublishedcourse", validatetoken,editpublishedcourse);

router.post("/deletedraftcourse", validatetoken,deletedraftcourse);
router.post("/completechapter", validatetoken,completeChapter);
module.exports = router;