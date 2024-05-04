const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
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
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
            required: true
        }],
        progressReports: {
            type: Map,
            of: {
                lastAccessed: Date,
                chaptersDone: [Number]
            }
        }
        
    },
    { 
        collection: "users",
        timestamps: true
    }
);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
