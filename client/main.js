import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

TestDB = new Mongo.Collection('test');

if (Meteor.isClient) {
    Meteor.subscribe("userData")
    //Menu
    Template.menu.events({
        "click #menu": function() {
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
        },
        "click #alertTest": function() {
            alertify.alert('<a href="javascript:showConfirm();">Show Confirm</a>');
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
        $('#createAccountForm').validate();
        $('#loginForm').validate();
    })

    Template.login.events({
        "submit #loginForm": function(event) {
            event.preventDefault();
            var email = $('[name=loginEmail]').val();
            var password = $('[name=loginPassword]').val();
            Meteor.loginWithPassword(email,password, function(err) {
                if (err) {
                    $('#loginDiv').transition('shake');
                    alertify.alert(err.reason);
                }
            });
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
                    alertify.alert(err.reason)
                } else {
                    Meteor.loginWithPassword(user.email,user.password, function(err) {
                        if (err) {
                            $('#createAccountDiv').transition('shake');
                            alertify.alert(err.reason);
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
        $('.ui.dropdown').dropdown();
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
        'click #editProfileSubmit': function() {
            var userInfo = {
                bio: $('[name=bio]').val(),
                primaryInstrument: $('[name=primaryInstrument]').val(),
                secondaryInstruments: $('[name=secondaryInstruments]').val().split(','),
                skillLevel: $('[name=skillLevel]').val(),
                userRecording: $('[name=userRecording]').val(),
                groupsPurpose: $('[name=groupsPurpose]').val(),
                peopleWhoPlay: $('[name=peopleWhoPlay]').val().split(','),
                genres: $('[name=genres]').val().split(','),
                musicalInfluences: [$('[name=musicalInfluence1]').val(),$('[name=musicalInfluence2]').val(), $('[name=musicalInfluence3]').val()],
                favoriteSongs: [$('[name=favoriteSong1]').val(),$('[name=favoriteSong2]').val(), $('[name=favoriteSong3]').val()],
                favoriteAlbums:[$('[name=favoriteAlbum1]').val(),$('[name=favoriteAlbum2]').val(), $('[namefavoriteAlbume3]').val()],
                website: $('[name=website]').val(),
            };
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.userInfo": userInfo}}, function(err) {
                if (err) {
                    alertify.alert('Profile Change Unsuccessful', "Sorry, something went wrong :(")
                } else {
                    alertify.alert('Yay!', 'Changes saved!')
                    $('.shape').shape('flip over')
                }
            })
        },
        'keypress input': function(e) {
            Session.set('profileChangesSaved', false);
        }
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