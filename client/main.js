import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

usersDB = new Mongo.Collection('usersDB');

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (Meteor.isClient) {
    Meteor.subscribe("matches");
    Meteor.subscribe("userData");

    //Main Template
    Template.main.events({
        "click #sideMenu": function() {
            $(".ui.sidebar").sidebar('show')
        },
        "click #cameraButton": function() {
            MeteorCameraUI.getPicture();
        },
        "click #logoutButton": function() {
            Meteor.logout();
        },
        "click #alertTest": function() {
            alertify.alert('<a href="javascript:showConfirm();">Show Confirm</a>');
        }    
    });

    Template.menu.events({
        "click #menu": function() {
            $(".ui.sidebar").sidebar('hide');
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
        this.$('.shape').shape();
        this.$('.ui.dropdown').dropdown();

        //Inserting Existing Profile Info
        if (typeof Meteor.user().profile != "undefined") {
            $('[name=bio]').val(Meteor.user().profile.userInfo.bio);
            $('#primaryInstrumentDropdown').dropdown('set selected',Meteor.user().profile.userInfo.primaryInstrument);
            $('#secondaryInstrumentsDropdown').dropdown('set selected', Meteor.user().profile.userInfo.secondaryInstruments);
            $('#skillDropdown').dropdown('set selected', Meteor.user().profile.userInfo.skillLevel);
            $('[name=userRecording').val(Meteor.user().profile.userInfo.userRecording)
            $('#groupsPurposeDropdown').dropdown('set selected', Meteor.user().profile.userInfo.groupsPurpose)
            $('#peopleWhoPlayDropdown').dropdown('set selected', Meteor.user().profile.userInfo.peopleWhoPlay)
            $('#genresDropdown').dropdown('set selected', Meteor.user().profile.userInfo.genres)
            $('[name=musicalInfluence1]').val(Meteor.user().profile.userInfo.musicalInfluences[0])
            $('[name=musicalInfluence2]').val(Meteor.user().profile.userInfo.musicalInfluences[1])
            $('[name=musicalInfluence3]').val(Meteor.user().profile.userInfo.musicalInfluences[2])
            $('[name=favoriteSong1]').val(Meteor.user().profile.userInfo.favoriteSongs[0])
            $('[name=favoriteSong2]').val(Meteor.user().profile.userInfo.favoriteSongs[1])
            $('[name=favoriteSong3]').val(Meteor.user().profile.userInfo.favoriteSongs[2])
            $('[name=favoriteAlbum1]').val(Meteor.user().profile.userInfo.favoriteAlbums[0])
            $('[name=favoriteAlbum2]').val(Meteor.user().profile.userInfo.favoriteAlbums[1])
            $('[name=favoriteAlbum3]').val(Meteor.user().profile.userInfo.favoriteAlbums[2])
            $('[name=website]').val(Meteor.user().profile.userInfo.website);
        }
    });

    Template.profile.helpers({
        'firstName': function() {
            return Meteor.user().firstName
        },
        'lastName': function() {
            return Meteor.user().lastName
        },
        'primaryInstrument': function() {
            if (typeof Meteor.user().profile != "undefined") {
                return Meteor.user().profile.userInfo.primaryInstrument.capitalizeFirstLetter();
            }
        },
        'bio': function() {
            if (typeof Meteor.user().profile != "undefined") {
                return Meteor.user().profile.userInfo.bio
            } else {
                return 'Nothing here yet :(';
            }
        },
        'profilePicture': function() {
            return Meteor.user().profile.userInfo.profilePicture;
        }
    });

    Template.profile.events({
        'click #flipCard': function() {
            $('.shape').shape('flip back')
        },
        // 'click .ui.dropdown': function() {
        //     $('.ui.dropdown').focus();
        // },
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
                favoriteAlbums:[$('[name=favoriteAlbum1]').val(),$('[name=favoriteAlbum2]').val(), $('[name=favoriteAlbum3]').val()],
                website: $('[name=website]').val(),
                matchable: true,
            };
            Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.userInfo": userInfo}}, function(err) {
                if (err) {
                    alertify.alert('Profile Change Unsuccessful', "Sorry, something went wrong :(")
                } else {
                    usersDB.upsert({
                        _id: Meteor.user()._id
                    }, {
                        $set: {
                            userID: Meteor.user()._id,
                            firstName: Meteor.user().firstName, 
                            lastName: Meteor.user().lastName,
                            primaryInstrument: Meteor.user().profile.userInfo.primaryInstrument,
                            secondaryInstruments: Meteor.user().profile.userInfo.secondaryInstruments,
                            skillLevel: Meteor.user().profile.userInfo.skillLevel,
                            userRecording: Meteor.user().profile.userInfo.userRecording,
                            groupsPurpose: Meteor.user().profile.userInfo.groupsPurpose,
                            peopleWhoPlay: Meteor.user().profile.userInfo.peopleWhoPlay,
                            genres: Meteor.user().profile.userInfo.genres,
                            musicalInfluences: Meteor.user().profile.userInfo.musicalInfluences,
                            favoriteAlbums: Meteor.user().profile.userInfo.favoriteAlbums,
                            website: Meteor.user().profile.userInfo.website,
                        }
                    })
                    alertify.alert('Yay!', 'Changes saved!', function() {
                        $('.shape').shape('flip over')
                    })
                }
            })
        },
        'keypress input': function(e) {
            Session.set('profileChangesSaved', false);
        }
    })

    Template.modalContent.events({
        "click #modalToProfile": function() {
            FlowRouter.go('/profile')
            $('.ui.basic.modal').modal('hide');
        },
        "click #closeModal": function() {
            $('.ui.basic.modal').modal('hide');
        }
    })

    Template.matches.helpers({
        'matchedUsers': function() {
            var initialMatchArray = []
            var matchArray = []

            //Matching Algorithim - currently very hacky and inefficent, will return to this later.
            //Need to grab users whose secondary instruments are match, currently only grabbing primary instrument.
            for (var i=0; i<Meteor.user().profile.userInfo.peopleWhoPlay.length; i++) {
                initialMatchArray = initialMatchArray.concat(usersDB.find({primaryInstrument:Meteor.user().profile.userInfo.peopleWhoPlay[i]}).fetch())
            }
            initialMatchArray.forEach(function(match) {
                if (match._id != Meteor.user()._id) {
                    matchArray.push(match);
                }
            })
            return matchArray
        }
    })

    Template.modalContent.helpers({
        'userFirst': function() {
            return Meteor.user().firstName;
        }
    });

    Template.s3_tester.onRendered(function() {
        $("#profilePictureUpload").hide();
        $("#pictureUploadLoader").hide();
        $("#checkSuccess").hide();
    });

    Template.s3_tester.events({
        //Styling of default upload input is ugly, using own button to click the file selector button
        "click #uploadProxy": function() {
            $("#profilePictureUpload").click();
        },
        //As soon as an image is selected, it is uploaded to database.
        'change input[type=file]': function (e, tmpl) {
            var files = $("input.file_bag")[0].files
            $("#uploadProxy").hide();
            $("#pictureUploadLoader").show()
            S3.upload({
                    files:files,
                    path:"profilePictures"
                },function(e,r){
                    if (r) {
                        Meteor.users.update({_id:Meteor.user()._id}, {$set: {"profile.userInfo.profilePicture":r.url}});
                        console.log(r)
                        $("#pictureUploadLoader").hide()
                        $("#checkSuccess").show()
                        $("#checkSuccess").transition('tada')
                    }
            });
        }
    });

    Template.s3_tester.helpers({
        "files": function(){
            return S3.collection.find();
        }
    });
}