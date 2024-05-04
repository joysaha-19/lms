const mongoose = require("mongoose");

const studentcourseSchema = mongoose.Schema(
  {
    course_name: {
      type: String,
    },
    course_desc: {
      type: String,
    },
    course_instructor: {
      type: String,
    },
    course_cost: {
      type: Number,
    },
    enrolled: [{
      type: String
    }],
    chapters: [{
      name: { type: String },            // Name of the chapter
      completeStatus: { type: Boolean }  // Completion status: true or false
    }],
    tag: { 
      type: String
    }
  },
  { 
    collection: "Courses",
    timestamps: true 
  }
);

studentcourseSchema.index({"course_name":"text"}); // Text index for course_name

module.exports = mongoose.model("Courses", studentcourseSchema);
