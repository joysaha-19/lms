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
  editpublishedcourse,
  add_draftcourse
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
router.post("/addtodraft", validatetoken,add_draftcourse);
router.post("/deletedraftcourse", validatetoken,deletedraftcourse);
router.post("/completechapter", validatetoken,completeChapter);
module.exports = router;