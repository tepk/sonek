Meteor.publish('recent_issues', function() {
    return Issues.find({});
})

Meteor.publish('crew', function() {
    return Crew.find({});
})

Meteor.publish('address', function() {
    return Address.find({});
})


