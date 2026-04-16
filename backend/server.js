const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Add this
const uploadRoute = require("./api/upload");
app.use("/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("DRPL Analytics API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});