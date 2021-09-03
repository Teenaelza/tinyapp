const { assert } = require("chai");

const { UserExists, emailValidation } = require("../helpers.js");

const testUsers = {
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

describe("UserExists", function () {
  it("should return true  if  valid email", function () {
    const user = UserExists("user@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(expectedOutput, user);
  });
  it("should return false with  email not there", function () {
    const user = UserExists("user3@example.com", testUsers);
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});
describe("emailValidation", function () {
  it("should return false  if email or password or both  are  empty", function () {
    const result = emailValidation("", "");
    const expectedOutput = false;
    assert.equal(expectedOutput, result);
  });
  it("should return true when  both are not empty ", function () {
    const result = emailValidation("user3@example.com", "somepassword");
    const expectedOutput = true;
    assert.equal(result, expectedOutput);
  });
});
