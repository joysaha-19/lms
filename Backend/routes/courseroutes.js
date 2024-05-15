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
  deletedraftedcourse,
  completeChapter,
  editpublishedcourse,
  adddraftcourse,
  editdraftedcourse,
  getdraftedcourse,
  publishdraftedcourse

} = require("../controllers/coursecontroller");
const validatetoken = require("../middleware/accesstokenhandler2");
// Define your routes here, for example:
router.get("/spcourse", validatetoken, getcourse);
router.get("/spdraftcourse", validatetoken, getdraftedcourse);

router.get("/allcourses",validatetoken,  getallcourses);
router.get("/usercourses",validatetoken,  getallusercourses);
router.post("/enroll", validatetoken, enrollincourse);
router.get("/seecourse",validatetoken,seecourse);
router.post("/addcourse", validatetoken ,addcourse);
router.post("/publishdraftedcourse",validatetoken, publishdraftedcourse );

router.post("/deletepublishedcourse", validatetoken,deletepublishedcourse);
router.post("/editpublishedcourse", validatetoken,editpublishedcourse);
router.post("/editdraftedcourse", validatetoken,editdraftedcourse);

router.post("/addtodraft", validatetoken,adddraftcourse);
router.post("/deletedraftedcourse", validatetoken,deletedraftedcourse);
router.post("/completechapter", validatetoken,completeChapter);
module.exports = router;