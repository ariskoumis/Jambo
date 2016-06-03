import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  TestDB = new Mongo.Collection('test');

});
