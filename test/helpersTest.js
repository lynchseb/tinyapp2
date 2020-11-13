const { assert } = require('chai');

const { checkRegistration } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkRegistration', function() {
  it('should return an error object if the email is not available', function() {
    const user = checkRegistration("user@example.com", "hello", testUsers)
    const expectedOutput = "object";
    assert.typeOf(user, expectedOutput)
  });

  it('should return true is the email is available', function() {
    const user = checkRegistration("user234@example.com", "hello",testUsers)
    const expectedOutput = true
    assert.equal(user, expectedOutput)
  });
});