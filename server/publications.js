Meteor.publish('recent_issues', function() {
    return Issues.find({});
})

Meteor.publish('crew', function() {
    return Crew.find({});
})

Meteor.publish('payments', function() {
    return Payments.find({});
})

Meteor.publish('address', function() {
    return Address.find({}, {fields: {district: 1}});
})

Meteor.publish('addressByDistrict', function(id) {
    return Address.find({_id: id});
})


