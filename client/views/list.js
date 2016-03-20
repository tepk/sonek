Template.list.onCreated(function () {
    this.subscribe('recent_issues');
    this.subscribe('crew');

})

Template.list.onRendered(function () {

})

Template.list.helpers({
    issues: function () {
        return Issues.find({}, {sort: {assignDate: 1}});
    },

    issueActive: function () {

        var currIssue = Issues.findOne({_id: this._id})
        if (currIssue) {

            if (currIssue.issueActive) {
                return "active"
            } else {
                return "inactive"
            }
        }
    },


    performer: function () {
        var crew = Crew.findOne({userId: this.performer});
        if (crew) {
            return crew.lname + " " + crew.fname;
        } else {
            return "всем"
        }
    }
})

Template.list.events({
    "click #hideComplete": function () {

    },
    "click .logOut": function () {
        Meteor.logout()
    }
})