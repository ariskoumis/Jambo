import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

TestDB = new Mongo.Collection('test');

if (Meteor.isClient) {

    //Menu
    Template.menu.events({
        "click #menuHome": function() {

        },
        "click #menuInbox": function() {

        },
    });

    //Page
    Template.main.onRendered(function() {

    });

    Template.main.events({

    });

    Template.main.helpers({

    });

    //Form
    Template.editProfile.events({

    });

    Template.databaseTest.events({
        "click #dbTestSubmit": function() {
            var user = {
                name: $('#dbName').val(),
                username: $('#dbUsername').val(),
                email: $('#dbEmail').val(),
            };
            TestDB.insert(user)
            console.log('submitted', user)
        },
    })

    Template.databaseTest.helpers({
        'users': function() {
            return TestDB.find();
        }
    })
}