import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';

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

    })

}