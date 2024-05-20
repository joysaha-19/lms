const express = require("express");
const app = express();
const connectDb = require("./config/dbconnection");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

const port = 5000;
connectDb();

// Enable express to parse JSON bodies
app.use(express.json());

// Manually set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or specify a specific domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Origin, Authorization, Username, username, authorization');
  next();
});

app.use("/lms/courses", require("./routes/courseroutes"));
app.use("/lms/users", require("./routes/userroutes"));
app.use("/lms/teachers", require("./routes/teacherroutes"));

// Error handling middleware
app.use(errorhandler);

// Start the server
app.listen(port, () => {
  console.log("Server running on port " + port);
});
