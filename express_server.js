/**
 * Seting up the server for the Tiny app project
 */
const express = require("express");
const bodyParser = require("body-parser");
const PORT = "3000";
const app = express();
app.set("view engine", "ejs");
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.use(bodyParser.urlencoded({ extended: true }));
const generateRandomString = () => {};
app.get("/u/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const longURL = urlDatabase[short];
  res.redirect(longURL);
});

//welcome page
app.get("/", (req, res) => {
  res.send("Welcome");
});
//Hello Page
app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//url index page : directs to the url-index template page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//it will display the long url corresponding to the short url parameter that is send via request
app.get("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const templateVars = { shortURL: short, longURL: urlDatabase[short] };
  res.render("urls_show", templateVars);
});
//display the url object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
