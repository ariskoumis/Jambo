import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

if (Meteor.isClient) {

    Template.page.events({
        "click #createProfile": function (event,template) {
            Session.set('displayHome', false)
            Session.set('currentPage', "> form");
        }
    });

    Template.page.helpers({
        displayHome: function() {
            return Session.get("displayHome");
        },
    });

}