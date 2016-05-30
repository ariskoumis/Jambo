import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

if (Meteor.isClient) {

    //Menu
    Template.menu.events({
        "click #menuHome": function() {
            Session.set('displayHome', true);
        },
        "click #menuInbox": function() {
            Session.set('currentPage', "inbox");
            Session.set('displayHome', false);
        },
    });

    //Page
    Template.page.onRendered(function() {
        Session.set("displayHome", true)
    });

    Template.page.events({
        "click #createProfile": function (event,template) {
            Session.set('currentPage', "form");
            Session.set('displayHome', false)
        },
        "click #inbox": function (event,template) {
            Session.set('currentPage', "inbox");
            Session.set('displayHome', false)
        }
    });

    Template.page.helpers({
        getCurrentPage: function() {
            return Session.get("currentPage");
        },
        displayHome: function() {
            return Session.get("displayHome");
        },
    });

    //Form
    Template.form.events({
        "blur #username": function() {
            console.log($('#username').val())
        }
    })

}