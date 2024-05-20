const express = require("express");
const app = express();
const connectDb = require("./config/dbconnection");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

const cors = require('cors');
const port = 5000;
connectDb();
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://664b8966da79e8fd6fb95f7e--joydeep-lms.netlify.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

// Apply CORS middleware with the defined options


app.use(express.json());
app.use("/lms/courses", require("./routes/courseroutes"));
app.use("/lms/users", require("./routes/userroutes"));
app.use("/lms/teachers", require("./routes/teacherroutes"));

app.use(errorhandler);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
