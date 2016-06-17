import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

TestDB = new Mongo.Collection('test');

if (Meteor.isClient) {
    Meteor.subscribe("userData")
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
        },
        "click #logoutButton": function() {
            Meteor.logout();
        }
    });

    Template.main.helpers({

    });

    //Form
    Template.edit_profile.events({

    });

    Template.database_test.events({
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


    Template.database_test.helpers({
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
            console.log('HEYHEY')
            event.preventDefault();
            var email = $('[name=loginEmail]').val();
            var password = $('[name=loginPassword]').val();
            console.log('HEYYOU')
            Meteor.loginWithPassword(email,password, function(err) {
                if (err) {
                    $('#loginDiv').transition('shake');
                    $('#errorList').append('<li>'+err.reason+'</li>');
                    $('#errorDiv').show()
                }
            });
            console.log('love debugging')
        },
        "submit #createAccountForm": function(event) {
            event.preventDefault();
            var user = {
                email: $('[name=email]').val(),
                firstName: $('[name=firstName]').val(),
                lastName: $('[name=lastName]').val(),
                password: $('[name=password]').val(),
                birthday: $('[name=birthday]').val()
            }
            Accounts.createUser(user, function(err) {
                if (err) {
                    $('#createAccountDiv').transition('shake');
                    $('#errorList').append('<li>'+err.reason+'</li>');
                    $('#errorDiv').show()
                } else {
                    Meteor.loginWithPassword(user.email,user.password, function(err) {
                        if (err) {
                            $('#createAccountDiv').transition('shake');
                            $('#errorList').append('<li>'+err.reason+'</li>');
                            $('#errorDiv').show()
                        } else {
                            $('.ui.basic.modal').modal('show');
                        }
                    });
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
        "click #backToLogin": function() {
            $('#createAccountDiv').hide(500)
            $('#forgotPasswordDiv').hide(500)
            $('#loginDiv').show(500)
        }
    })

    Template.profile.onRendered(function() {
        $('.ui.fluid.card').transition('bounce');
        $('.shape').shape();
    });

    Template.profile.helpers({
        'firstName': function() {
            return Meteor.user().firstName
        },
        'lastName': function() {
            return Meteor.user().lastName
        },
    });

    Template.profile.events({
        'click #flipCard': function() {
            $('.shape').shape('flip back')
        },
        'click #flipCard2': function() {
            $('.shape').shape('flip over')
        },
    })

    Template.modalContent.events({
        "click #modalToProfile": function() {
            console.log('this is wokring')
            FlowRouter.go('/profile')
            $('.ui.basic.modal').modal('hide');
        },
        "click #closeModal": function() {
            console.log('this isnt')
            $('.ui.basic.modal').modal('hide');
        }
    })
}