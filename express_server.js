const express = require("express");
const PORT = "3000";
const app = express();
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
