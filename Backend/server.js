const express = require("express");
const app = express();
const connectDb = require("./config/dbconnection");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

const cors = require('cors');
const port = 5000;
connectDb();
app.use(cors());
// Allow preflight checks for all routes
app.options('*', (req, res, next) => {
  console.log('Received OPTIONS request for:', req.path);
  cors()(req, res, next);
});

app.use(express.json());
app.use("/lms/courses", require("./routes/courseroutes"));
app.use("/lms/users", require("./routes/userroutes"));
app.use("/lms/teachers", require("./routes/teacherroutes"));

app.use(errorhandler);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
