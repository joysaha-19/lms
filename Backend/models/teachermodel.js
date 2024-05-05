const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add your username."],
        },
        email: {
            type: String,
            required: [true, "Please add your emailId."],
            unique: [true, "Email address already taken"],
        },
        password: {
            type: String,
            required: [true, "Please add your password"],
        },
        published_courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
            required: true
        }],

        draft_courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
            required: true
        }],
        
    },
    { 
        collection: "teachers",
        timestamps: true
    }
);

const Teachers = mongoose.model("Teachers", TeacherSchema);
module.exports = Teachers;
