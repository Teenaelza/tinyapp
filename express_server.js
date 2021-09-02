/**
 * Seting up the server for the Tiny app project
 */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const PORT = "3000";
const app = express();
app.set("view engine", "ejs");
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
  if (email.trim() && password.trim()) {
    return true;
  }
  return false;
};
const inputValidation = (input) => {
  if (input.trim()) {
    return true;
  }
  return false;
};
//function to check the user already exists
const userExist = (email) => {
  for (key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
};
//function to check the user and password are equal
const passwordValidation = (email, password) => {
  for (user in users) {
    const isHashed = bcrypt.compareSync(password, users[user].password);
    if (users[user].email === email && isHashed) {
      return users[user].id;
    }
  }
  return false;
};
const urlsForUser = (id) => {
  let userURL = {};
  for (key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      let longURL = urlDatabase[key].longURL;
      let userID = urlDatabase[key].userID;
      userURL[key] = { longURL, userID };
    }
  }
  return userURL;
};
const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === "{}";
};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//when clik on the link
app.get("/u/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const longURL = urlDatabase[short].longURL;
  res.redirect(longURL);
});
//url index page : directs to the url-index template page
app.get("/urls", (req, res) => {
  const templateVars = {};
  templateVars["error"] = "";

  if (isEmptyObject(req.cookies)) {
    // res.redirect("/login");
    // return;
    const error = "The User is not logged in .Please Log in";
    templateVars["error"] = error;
    templateVars["user"] = undefined;
    res.render("urls_login", templateVars);
    return;
  } else {
    const userIdKey = req.cookies["user_id"];
    templateVars["urls"] = urlsForUser(userIdKey);
    templateVars["user"] = users[userIdKey];
    res.render("urls_index", templateVars);
    return;
  }
});
//request to create a new short urlDatabase;
app.get("/urls/new", (req, res) => {
  const templateVars = {};
  templateVars["error"] = "";

  if (isEmptyObject(req.cookies)) {
    // res.redirect("/login");
    // return;
    const error = "The User is not logged in .Please Log in";
    templateVars["error"] = error;
    templateVars["user"] = undefined;
    res.render("urls_login", templateVars);
    return;
  } else {
    const userIdKey = req.cookies["user_id"];
    templateVars["user"] = users[userIdKey];
    res.render("urls_new", templateVars);
    return;
  }
});
app.get("/register", (req, res) => {
  const templateVars = { user: undefined, error: "" };
  res.render("urls-registration", templateVars);
});
app.get("/login", (req, res) => {
  const templateVars = { user: undefined, error: "" };
  res.render("urls_login", templateVars);
});
//it will display the long url corresponding to the short url parameter that is send via request
app.get("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const templateVars = {
    shortURL: short,
    longURL: urlDatabase[short].longURL,
  };
  templateVars["error"] = "";

  if (isEmptyObject(req.cookies)) {
    // res.redirect("/login");
    // return;
    const error = "The User is not logged in .Please Log in";
    templateVars["error"] = error;
    templateVars["user"] = undefined;
    res.render("urls_login", templateVars);
    return;
  } else {
    const userIdKey = req.cookies["user_id"];
    templateVars["user"] = users[userIdKey];
    res.render("urls_show", templateVars);
    return;
  }
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
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  const userID = req.cookies.user_id;

  if (!inputValidation(longURL)) {
    return res.status(400).send("Input field is empty");
  }

  urlDatabase[shortURL] = { longURL, userID };
  console.log("the new urldatavas:", urlDatabase);
  console.log(`added a new url: ${urlDatabase[shortURL]}`);
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
  const longURL = req.body.longURL;
  if (!inputValidation(longURL)) {
    return res.status(400).send("Input field is empty");
  }
  const short = req.params.shortURL;
  urlDatabase[short].longURL = longURL;
  console.log(`updated the url ${urlDatabase[short]}`);
  res.redirect("/urls");
});
//login button is clicked
app.post("/login", (req, res) => {
  console.log(req.body);
  const password = req.body.password;
  const email = req.body.email;
  console.log(users);
  if (!emailValidation(email, password)) {
    return res.status(400).send("Email/Password is empty");
  }
  if (!userExist(email)) {
    console.log(userExist(email));
    return res.status(403).send("User with the emailid not Found");
  }
  const userid = passwordValidation(email, password);
  if (!userid) {
    return res.status(403).send("User and password doesnot match");
  }
  res.cookie("user_id", userid);
  console.log(`set usedid cookie to ${userid}`);

  console.log("new user login:", email);
  res.redirect("/urls");
});

//when submit is clicked from the registration page
app.post("/register", (req, res) => {
  //console.log(req.body);
  const password = req.body.password;
  const email = req.body.email;
  if (!emailValidation(email, password)) {
    return res.status(400).send("Email/Password is empty");
  }
  if (userExist(email)) {
    return res.status(400).send("User already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString(8);
  users[id] = { id, email, password: hashedPassword };
  res.cookie("user_id", id);
  console.log("new user create:", users);
  console.log(`set usedid cookie to ${id}`);
  res.redirect("/urls");
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
