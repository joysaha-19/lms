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
      description:{type: String}
    }],
    tag: { 
      type: String
    },
    image: { type: Buffer }  // Storing image data as binary

  },
  { 
    collection: "Courses",
    timestamps: true 
  }
);

studentcourseSchema.index({"course_name":"text"}); // Text index for course_name

module.exports = mongoose.model("Courses", studentcourseSchema);
