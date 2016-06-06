import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  TestDB = new Mongo.Collection('test');

  Accounts.onCreateUser(function(options, user) {
  	user.firstName = options.firstName;
  	user.lastName = options.lastName;
  	user.birthday = options.birthday;
  	return user
  })
});
