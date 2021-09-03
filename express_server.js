/**
 * Seting up the server for the Tiny app project
 */
const express = require("express");
const {
  getUserByEmail,
  generateRandomString,
  emailValidation,
  inputValidation,
  urlsForUser,
  isEmptyObject,
} = require("./helpers");

const cookieSession = require("cookie-session");
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
//function to check the user and password are equal
const passwordValidation = (email, users, password) => {
  for (user in users) {
    let isHashed = bcrypt.compareSync(password, users[user].password);
    if (users[user].email === email && isHashed) {
      return users[user].id;
    }
  }
  return false;
};
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);
// GET /
app.get("/", (req, res) => {
  const sessionId = req.session.user_id;
  if (isEmptyObject(sessionId) || !sessionId) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

//GET /urls
app.get("/urls", (req, res) => {
  const templateVars = {};
  // templateVars["error"] = "";
  const sessionId = req.session.user_id;
  if (isEmptyObject(sessionId) || !sessionId) {
    return res
      .status(400)
      .send(`The User is not logged in .Please <a  href="/login">Log in</a>`);
  }
  const userIdKey = req.session.user_id;
  templateVars["urls"] = urlsForUser(userIdKey, urlDatabase);
  templateVars["user"] = users[userIdKey];
  res.render("urls_index", templateVars);
});
//GET /urls/new
app.get("/urls/new", (req, res) => {
  const templateVars = {};
  const sessionId = req.session.user_id;
  if (isEmptyObject(sessionId) || !sessionId) {
    res.redirect("/login");
    return;
  }
  const userIdKey = req.session.user_id;
  templateVars["user"] = users[userIdKey];
  res.render("urls_new", templateVars);
});
//loginpage
app.get("/login", (req, res) => {
  const templateVars = { user: undefined };
  res.render("urls_login", templateVars);
});
//when clik on the link
app.get("/u/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const longURL = urlDatabase[short].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { user: undefined, error: "" };
  res.render("urls-registration", templateVars);
});

//GET /urls/:id
app.get("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
  const userIdKey = req.session.user_id;
  const userURLS = urlsForUser(userIdKey, urlDatabase);
  if (isEmptyObject(userIdKey) || !userIdKey) {
    return res
      .status(400)
      .send(`The User is not logged in .Please <a  href="/login">Log in</a>`);
  }
  if (isEmptyObject(userURLS) || !userURLS || !userURLS[short]) {
    return res.status(400).send("There is no URL for the given ID");
  }

  const templateVars = {
    shortURL: short,
    longURL: userURLS[short].longURL,
  };
  templateVars["user"] = users[userIdKey];
  res.render("urls_show", templateVars);
  return;
});
//display the url object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//when logout link is clicked
app.get("/logout", (req, res) => {
  // res.clearCookie("sesson");
  req.session.user_id = null;
  console.log(`reset cookie`);
  res.redirect("/urls");
});
//index page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  const userID = req.session.user_id;

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
  if (!getUserByEmail(email, users)) {
    return res.status(403).send("User with the emailid not Found");
  }
  const userid = passwordValidation(email, users, password);
  if (!userid) {
    return res.status(403).send("User and password doesnot match");
  }
  // res.cookie("user_id", userid);
  req.session.user_id = userid;
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
  if (getUserByEmail(email, users)) {
    return res.status(400).send("User already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString(8);
  users[id] = { id, email, password: hashedPassword };
  //res.cookie("user_id", id);
  req.session.user_id = id;
  console.log("new user create:", users);
  console.log("set user_id session");
  res.redirect("/urls");
});
app.listen(PORT, () => console.log(`This server is listening to ${PORT}!`));
