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
    Template.createProfile.events({

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

    Template.login.onRendered(function(){
        $('#createAccountDiv').hide();
        $('#forgotPasswordDiv').hide();
    })

    Template.login.events({
        "submit #loginForm": function(event) {
            event.preventDefault();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email,password, function(err) {
                if (err) {
                    $('#loginDiv').transition('shake');
                }
            });
        },
        "submit #createAccountForm": function(event) {
            event.preventDefault();
            var email = $('[name=email]').val();
            var firstName = $('[name=firstName]').val();
            var lastName = $('[name=lastName').val();
            var password = $('[name=password]').val();
        },
        "click #createAccount": function() {
            $('#loginDiv').hide(500);
            $('#createAccountDiv').show(500);
        },
        "click #forgotPassword": function() {
            $('#loginDiv').hide(500);
            $('#forgotPasswordDiv').show(500);
        },
    })
}