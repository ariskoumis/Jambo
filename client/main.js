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
        $('#errorDiv').hide();
        $('#createAccountForm').validate();
        $('#loginForm').validate();
    })

    Template.login.events({
        "submit #loginForm": function(event) {
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email,password, function(err) {
                if (err) {
                    $('#loginDiv').transition('shake');
                    $('#errorList').append('<li>'+err.reason+'</li>');
                    $('#errorDiv').show()
                }
                else {
                    console.log('all good')
                }
            });
            event.preventDefault();
        },
        "submit #createAccountForm": function(event) {
            console.log('submitting!')
            event.preventDefault();
            var user = {
                email: $('[name=email]').val(),
                firstName: $('[name=firstName]').val(),
                lastName: $('[name=lastName').val(),
                password: $('[name=password]').val(),
                birthday: $('[name=birthday]').val()
            }
            Accounts.createUser(user, function(err) {
                if (err) {
                    $('#createAccountDiv').transition('shake');
                    $('#errorList').append('<li>'+err.reason+'</li>');
                    $('#errorDiv').show()
                } else {
                    Meteor.loginWithPassword(user.email,user.password);
                }
            });
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