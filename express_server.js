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
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
// app.get("/set", (req, res) => {
//   let a = 0;
//   res.send(`a=${a}`);
// });
// app.get("/fetch", (req, res) => {
//   res.send(`a=${a}`);
// });
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
