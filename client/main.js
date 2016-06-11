import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

TestDB = new Mongo.Collection('test');

if (Meteor.isClient) {

    //Menu
    Template.menu.events({
        "click #menuHome": function() {
            $(".ui.sidebar").sidebar('hide');
            console.log('hey')
        },
        "click #menuInbox": function() {
            $(".ui.sidebar").sidebar('hide');
        },
    });

    Template.menu.helpers({
        'currentPageHeader': function() {
            var string = Session.get('currentPage')
            //Capitalize Multi-word Title
            if (string.indexOf("_") != -1) {
                var position = string.indexOf("_");
                string = string.substr(0,string.indexOf("_")) + " " + string.substr(string.indexOf("_")+1)
                string = string.slice(0,position+1)+string.charAt(position+1).toUpperCase()+string.slice(position+2,string.length)
            }
            string = string.charAt(0).toUpperCase() + string.slice(1); 
            return string
        }
    })

    //Page
    Template.main.events({
        "click #sideMenu": function() {
            $(".ui.sidebar").sidebar('show')
        },
        "click #testButton": function() {
            MeteorCameraUI.getPicture();
        }
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
            var email = $('[name=loginEmail]').val();
            var password = $('[name=loginPassword]').val();
            Meteor.loginWithPassword(email,password, function(err) {
                if (err) {
                    $('#loginDiv').transition('shake');
                    $('#errorList').append('<li>'+err.reason+'</li>');
                    $('#errorDiv').show()
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
                    $('.ui.basic.modal').modal('show');
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