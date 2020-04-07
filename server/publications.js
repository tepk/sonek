Meteor.publish('crew', function() {
    if (this.userId) {
        return Crew.find({});
    } else {
        return []
    }
})

Meteor.publish('payments', function() {
    if (this.userId) {
        return Payments.find({});
    } else {
        return []
    }
})

Meteor.publish('userlist', function() {
    return Meteor.users.find({});
})

Meteor.publish('rules', function() {
    return Rules.find({});
})


