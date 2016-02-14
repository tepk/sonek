Meteor.publish('recent_issues', function() {
    return Issues.find({});
})