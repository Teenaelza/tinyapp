/**
 * Seting up the server for the Tiny app project
 */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = "3000";
const app = express();
app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 6);
};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/u/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const longURL = urlDatabase[short];
  res.redirect(longURL);
});
//url index page : directs to the url-index template page
app.get("/urls", (req, res) => {
  console.log("cookie:", req.cookies);
  const templateVars = {
    urls: urlDatabase,
  };
  if (req.cookies) {
    templateVars["username"] = req.cookies["username"];
  }
  res.render("urls_index", templateVars);
});
//request to create a new short urlDatabase;
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});
//it will display the long url corresponding to the short url parameter that is send via request
app.get("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const templateVars = {
    username: req.cookies["username"],
    shortURL: short,
    longURL: urlDatabase[short],
  };
  res.render("urls_show", templateVars);
});
//display the url object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//index page
app.post("/urls", (req, res) => {
  const newShort = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  console.log(newShort);
  urlDatabase[newShort] = req.body.longURL;
  console.log(`added a new url: ${urlDatabase[newShort]}`);
  res.redirect("/urls");
});
//when delete button is clicked
app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL;
  delete urlDatabase[short];
  console.log(`deleted the url ${short}`);
  res.redirect("/urls");
});
//edit link is clicked
app.post("/urls/:shortURL/edit", (req, res) => {
  const short = req.params.shortURL;
  urlDatabase[short] = req.body.longURL;
  console.log(`updated the url ${urlDatabase[short]}`);
  res.redirect("/urls");
});
//login button is clicked
app.post("/login", (req, res) => {
  //console.log(req.body.username);
  const cookieValue = req.body.username;
  res.cookie("username", cookieValue);
  console.log(`set cookie to ${cookieValue}`);
  res.redirect("/urls");
});
app.post("/logout", (req, res) => {
  //console.log(req.body.username);
  //const cookieValue = req.body.username;
  res.clearCookie("username");
  console.log(`reset cookie`);
  res.redirect("/urls");
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
