/**
 * Seting up the helperfunctions for the Tiny app project
 */
const bcrypt = require("bcryptjs");

//function to check the user already exists
const UserExists = (email, userDatabase) => {
  for (key in userDatabase) {
    if (userDatabase[key].email === email) {
      return true;
    }
  }
  return false;
};

//function to generate a random alpha numerical string for the given length
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
//function to check the user and hashedpassword are equal
const passwordValidation = (email, users, password) => {
  for (user in users) {
    let isHashed = bcrypt.compareSync(password, users[user].password);
    if (users[user].email === email && isHashed) {
      return users[user].id;
    }
  }
  return false;
};
//function to check for empty input values.
const inputValidation = (input) => {
  if (input.trim()) {
    return true;
  }
  return false;
};
//function to check whther the user is in the urldatabase
const urlsForUser = (id, urlDatabase) => {
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
//function to check for an empty object
const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === "{}";
};
module.exports = {
  UserExists,
  generateRandomString,
  emailValidation,
  inputValidation,
  urlsForUser,
  isEmptyObject,
  passwordValidation,
};
