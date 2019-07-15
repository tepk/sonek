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



