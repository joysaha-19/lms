const express = require("express");
const app = express();
const connectDb = require("./config/dbconnection");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

const cors = require('cors');
const port = process.env.PORT || 4000;
connectDb();
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization','Username','username','authorization']  // Custom headers allowed
};

// Apply CORS middleware with the defined options
app.use(cors(corsOptions));


app.use(express.json());
app.use("/lms/courses", require("./routes/courseroutes"));
app.use("/lms/users", require("./routes/userroutes"));
app.use("/lms/teachers", require("./routes/teacherroutes"));

app.use(errorhandler);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
