const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const app = express();
const notesRouter = require("./routes/note.route")
const userRouter = require("./routes/user.route");
const initializeDbConnection = require("./db/db.connection");
const PORT = process.env.PORT || 5000;
initializeDbConnection();

app.use(cors());
app.use(bodyParser.json());
app.use("/notes", notesRouter)
app.use("/user", userRouter)
app.get("/", (req, res) => {
  res.send("Google Keep")
})
app.get("*", (req, res) => {
  res.status(400).json("Page Not Found");
})

app.listen(PORT, () => {
  console.log("server started at", PORT);
});
