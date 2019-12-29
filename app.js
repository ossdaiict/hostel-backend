const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = 5000 || process.env.PORT;

const auth = require("./routers/auth");
const courier = require("./routers/courier");
const worker = require("./worker/schedule");

app.use(morgan("tiny")); // logging request
app.use(helmet()); // Sanitization of requests
app.use(express.json()); // Parsing requests as in JSON format
app.use(cors()); //Use CORS

app.use("/auth", auth);
app.use("/courier", courier);

// Connect to database
mongoose.connect(process.env.DATABASE_STRING);
mongoose.set("debug", true);
const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "MongoDB Error: "));
conn.on("connected", () => {
  console.log("Connected To Database...");
});

//worker file
worker();

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error, Something Broke" });
});

// Start Server
app.listen(port, () => console.log("Server running on port", port, "..."));
