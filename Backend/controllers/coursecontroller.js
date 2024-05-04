
const asynchandler = require("express-async-handler");
const Courses = require("../models/coursemodel");
const Users = require("../models/usermodel");

const getcourse=asynchandler(async(req,res)=>{
   const courseid=req.query.courseid;
   const course=await Courses.findById(courseid);
   res.status(200).json(course);
})
const getallusercourses = asynchandler(async (req, res) => {
  // console.log(req.query.username)

  try {
    const currUser = await Users.findOne({ username: req.query.username });
    const courselist= currUser["courses"];
    const progressReports= currUser["progressReports"];
    let coursesinfo={};
    for(let i=0;i<courselist.length;i++)
      {
        const coursedata=await Courses.findById(courselist[i]);
        const course_name=coursedata["course_name"];
        const course_desc=coursedata["course_desc"];
        const course_instructor=coursedata["course_instructor"];
        const course_cost=coursedata["course_cost"];
        const chapters=coursedata["chapters"];
        const tag=coursedata["tag"];
        const lastAccessed = progressReports.get(courselist[i]).lastAccessed;
const chaptersDone = progressReports.get(courselist[i]).chaptersDone;

        let obj=
        {
          "course_name":course_name,
          "course_desc":course_desc,
          "course_instructor":course_instructor,
          "course_cost":course_cost,
          "chapters":chapters,
          "tag":tag,
          "lastAccessed":lastAccessed,
          "chaptersDone":chaptersDone
        }

        coursesinfo[courselist[i]]=obj;
        
      }

      res.status(200).json(coursesinfo);


  } catch (err) {
    console.error('Error fetching user courses:', err);
    res.status(500).json({ "message": "-1" });
  }
});



const getallcourses = asynchandler(async (req, res) => {
  try {
    const courses = await Courses.find({});
    res.json(courses);
  } catch (err) {
    console.error('Error fetching all courses:', err);
    res.status(500).json({ "message": "-1" });
  }
});


const seecourse = asynchandler(async (req, res) => {
  try {
    const course = await Courses.findById( req.query.courseid);
   
      res.json(course);
    
  } catch (err) {
    console.error('Error fetching specific course:', err);
    res.status(500).json({ "message": "-1" });
  }
});


const enrollincourse = asynchandler(async (req, res) => {

const username=req.body.username;
const courseid=req.body.courseid;
try {
  const updatedCourse = await Courses.findByIdAndUpdate(
    courseid, // Ensure this variable is correctly defined or received from request
    { $addToSet: { enrolled: username } }, // Using $addToSet to avoid duplicates
    { new: true } // Return the updated document
    
    
  );
  let user = await Users.findOne({ username: username });
if (!user) {
    console.log('User not found');
    return;
}
user.courses.push(courseid); // Assuming courseId is the ID of a course to add

user.progressReports.set(courseid.toString(), {
    lastAccessed: new Date(),
    chaptersDone: []
});
await user.save();

  res.json({ message: "+1" });
} catch (err) {
  console.error('Error enrolling user:', err);
  res.status(500).json({ message: "-1" });
}
});

const addcourse = asynchandler(async (req, res) => {
  try {
    const { course_name, course_desc, course_instructor, course_cost, enrolled,chapters,tag } = req.body;
    const course = new Courses({
      course_name,
      course_desc,
      course_instructor,
      course_cost,
      enrolled,
      chapters,
      tag
    });
    const savedCourse = await course.save();
    res.status(201).json({message:"course successfully added"});
  } catch (error) {
    res.status(400).json({message:"-1"});
  }
});

const completeChapter = asynchandler(async (req, res) => {
  const { courseId, username, chapter_number } = req.body;

  try {
      // Find the user with the given username
      const user = await Users.findOne({ username: username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the courseId is in the user's courses
      if (!user.courses.includes(courseId)) {
          return res.status(404).json({ message: 'Course not found in user\'s enrolled courses' });
      }

      // Access or initialize the progress for the specified course
      const progress = user.progressReports.get(courseId.toString()) || {
          lastAccessed: new Date(),
          chaptersDone: []
      };

      // Add the chapter number if it's not already completed
      if (!progress.chaptersDone.includes(chapter_number)) {
          progress.chaptersDone.push(chapter_number);
          // Update the last accessed date
          progress.lastAccessed = new Date();

          // Update the user's progressReports field
          user.progressReports.set(courseId.toString(), progress);
          await user.save();

          res.status(200).json({ message: 'Chapter completed successfully', progress: progress });
      } else {
          res.status(400).json({ message: 'Chapter already completed' });
      }
  } catch (error) {
      console.error('Error completing chapter:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = {getcourse, getallcourses, getallusercourses, seecourse, enrollincourse, addcourse,completeChapter };