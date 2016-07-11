import { Meteor } from 'meteor/meteor';

var keys = require('/keys.js');

Meteor.startup(() => {
    // code to run on server at startup
    usersDB = new Mongo.Collection('usersDB');

    S3.config = {
        key: keys.aws.key,
        secret: keys.aws.secret,
        bucket: 'jamboapp',
        region:"us-west-1"
    };

    Accounts.onCreateUser(function(options, user) {
        user.firstName = options.firstName;
        user.lastName = options.lastName;
        user.birthday = options.birthday;
        return user
    })

    Meteor.publish("userData", function () {
        if (this.userId) {
            return Meteor.users.find({_id: this.userId},
            {fields: {'firstName': 1, 'lastName': 1}});
        } else {
            this.ready();
        }
    });

    Slingshot.fileRestrictions("myFileUploads", {
        allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
        maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
    });

    Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
        bucket: "jamboapp",
        region: "us-west-1",
        AWSAccessKeyId: keys.aws.key,
        AWSSecretAccessKey: keys.aws.secret,

        acl: "public-read",

        authorize: function () {
            //Deny uploads if user is not logged in.
            return true;
        },

        key: function (file) {
            //Store file into a directory by the user's username.
            return new Date().getTime() + "_" + file.name;
        }
    });
});
