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
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
//function to generate a random alpha numerical string of the given length
const generateRandomString = (length) => {
  return Math.random().toString(36).substr(2, length);
};
//function to check whether the email and password is not empty
const emailValidation = (email, password) => {
  console.log("email validate");
  if (email.trim() && password.trim()) {
    return true;
  }
  return false;
};
//function to check the user already exists
const userExist = (email) => {
  for (let user in users) {
    if (user.email === email) {
      return true;
    }
    return false;
  }
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
    const userIdKey = req.cookies["user_id"];
    templateVars["user"] = users[userIdKey];
  }
  res.render("urls_index", templateVars);
});
//request to create a new short urlDatabase;
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});
app.get("/register", (req, res) => {
  const templateVars = { user: undefined };
  res.render("urls-registration", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = { user: undefined };
  res.render("urls_login", templateVars);
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
//when logout link is clicked
app.get("/logout", (req, res) => {
  res.clearCookie("user_id");
  console.log(`reset cookie`);
  res.redirect("/urls");
});
//index page
app.post("/urls", (req, res) => {
  const newShort = generateRandomString(6);
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
  //const cookieValue = req.body.username;
  //res.cookie("username", cookieValue);
  //console.log(`set cookie to ${cookieValue}`);
  res.redirect("/urls");
});

//when submit is clicked from the registration page
app.post("/register", (req, res) => {
  console.log(req.body);
  const password = req.body.password;
  const email = req.body.email;
  if (!emailValidation(email, password)) {
    res.status(400);
    res.render("error", { error: "Email/Password is empty" });
  }
  if (userExist) {
    res.status(400);
    res.render("error", {
      error: "User Already Exists",
    });
  }

  const id = generateRandomString(8);
  users[id] = { id, email, password };
  res.cookie("user_id", id);
  console.log("new user create:", users);
  console.log(`set usedid cookie to ${id}`);
  res.redirect("/urls");
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
