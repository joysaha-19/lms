
const asynchandler = require("express-async-handler");
const Courses = require("../models/coursemodel");
const Users = require("../models/usermodel");
const Teachers = require("../models/teachermodel");

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
const courseid=req.body.courseId;
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
      const {
          course_name,
          course_desc,
          course_instructor,
          course_cost,
          enrolled,
          chapters,
          tag,
          teacherid,
      } = req.body;

      // Convert Base64 image string to a Buffer
      const course = new Courses({
          course_name,
          course_desc,
          course_instructor,
          course_cost,
          enrolled,
          chapters,
          tag,
      });

      const savedCourse = await course.save();
      const courseid = savedCourse._id.toString();

      await Teachers.findByIdAndUpdate(
          teacherid,
          { $addToSet: { published_courses: courseid } },
          { new: true, runValidators: true }
      ).then(updatedTeacher => {
          console.log('Updated Teacher:', updatedTeacher);
          res.status(201).json({ message: "Course successfully added", course: savedCourse });
      }).catch(error => {
          console.error('Error updating teacher:', error);
          throw new Error('Teacher update failed');
      });
  } catch (error) {
      console.error('Error adding course:', error);
      res.status(400).json({ message: "Failed to add course" });
  }
});
const deletepublishedcourse = asynchandler(async (req, res) => {
  const { courseid, teacherid } = req.body;
  try {
    // Retrieve the course to get the enrolled users
    const course = await Courses.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove the course from each enrolled user's list of courses and progressReports
    const updates = course.enrolled.map(async (username) => {
      await Users.findOneAndUpdate({ username: username }, {
          $pull: { courses: courseid },
          $unset: { [`progressReports.${courseid}`]: "" }
      });
  });

    // Execute all updates in parallel
    await Promise.all(updates);

    // Remove the course document
    await Courses.findByIdAndDelete(courseid);

    // Update the teacher document to remove the course from published_courses
    await Teachers.findByIdAndUpdate(teacherid, {
      $pull: { published_courses: courseid }
    });

    res.status(200).json({ message: "Course successfully deleted" });
  } catch (error) {
    console.error('Error deleting published course:', error);
    res.status(500).json({ message: "-1", error: error.message });
  }
});

const editpublishedcourse = asynchandler(async (req, res) => {
  const { course_id,course_name,course_desc,course_cost,chapters,courseDescription } = req.body;
  try {
    // Find the course by ID
    const course = await Courses.findById(course_id);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the course with new data from req.body
    if (course_name) course.course_name = course_name;
    if (course_desc) course.course_desc = course_desc;
    if (typeof course_cost === 'number') course.course_cost = course_cost;
    if (chapters) course.chapters = chapters;
    if (courseDescription) course.tag = courseDescription;

    // Save the updated course
    const updatedCourse = await course.save();

    // Respond with the updated course
    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error('Error editing published course:', error);
    res.status(500).json({ message: "-1", error: error.message });
  }
});


const add_draftcourse = asynchandler(async (req, res) => {
  const { course_title, tag, username, course_cost, chapters } = req.body;

  // Basic validation
  if (!course_title || !tag || !username || !course_cost || !chapters || !Array.isArray(chapters)) {
      return res.status(400).send("All fields are required and chapters should be an array.");
  }

  try {
      // Find the teacher by username
      const teacher = await Teachers.findOne({ username: username });

      if (!teacher) {
          return res.status(404).send("Teacher not found.");
      }

      // Create the draft course object
      const draftCourse = {
          course_title: course_title,
          tag: tag,
          course_cost: course_cost,
          chapters: chapters
      };

      // Add the draft course to the teacher's draft_courses array
      teacher.draft_courses.push(draftCourse);

      // Save the updated teacher document
      await teacher.save();

      res.status(200).send("Draft course added successfully.");
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while adding the draft course.");
  }
});



const deletedraftcourse = asynchandler(async (req, res) => {
  try {
    const { courseid ,teacherid} = req.body;
    await Teachers.findByIdAndUpdate(
      teacherid,
      { $pull:{ draft_courses: courseid } },  // $pull removes the specified courseId from the array
      { new: true, runValidators: true }  // Options to return the updated document and run schema validation
  )

    
    res.status(201).json({message:"course successfully added"});
  } catch (error) {
    res.status(400).json({message:"-1"});
  }
});



const completeChapter = asynchandler(async (req, res) => {
  const { courseId, username, chapter_name } = req.body;

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
      if (!progress.chaptersDone.includes(chapter_name)) {
          progress.chaptersDone.push(chapter_name);
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



module.exports = {getcourse, getallcourses, getallusercourses, seecourse, enrollincourse, addcourse,deletepublishedcourse, deletedraftcourse,completeChapter ,editpublishedcourse,add_draftcourse};