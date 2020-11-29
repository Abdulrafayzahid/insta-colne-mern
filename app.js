const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/keys");
const cors = require("cors");


app.use(cors());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongoose");
});

mongoose.connection.on("error", (error) => {
  console.log("Error Connecting to mongoose", error);
});

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log("App is running on PORT ", PORT);
});
