const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// test
app.get("/", (req, res) => {
  res.send("successfully working");
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
