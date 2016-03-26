Meteor.publish('recent_issues', function(arg) {
    if (arg) {
        return Issues.find({districtId: arg}, {fields: {pnumber: 0}});
    } else {
        return Issues.find({}, {fields: {pnumber: 0}});
    }
})

Meteor.publish('currentIssue', function(currId){
    return Issues.find({_id: currId}, {fields: {pnumber: 0}});
})

Meteor.publish('crew', function() {
    return Crew.find({});
})

Meteor.publish('address', function() {
    return Address.find({}, {fields: {district: 1}});
})

Meteor.publish('addressByDistrict', function(id) {
    return Address.find({_id: id});
})


