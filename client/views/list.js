Template.list.onCreated(function () {
    var self = this;
    this.subscribe('recent_issues');
    this.subscribe('crew');

})

Template.list.onRendered(function () {

})

Template.list.helpers({
    issues: function () {
        if (Session.get("hideCompleted")) {
            console.log(Issues.find({issueActive: true}, {sort: {assignDate: 1}}).fetch())
            return Issues.find({issueActive: true}, {sort: {assignDate: 1}});
        } else {
            return Issues.find({}, {sort: {assignDate: 1}});
        }
    },

    hideCompleted: function () {
        return Session.get("hideCompleted");
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
    "change #hideCompleted input":
        function (event) {
            Session.set("hideCompleted", event.target.checked);
        },
    "click .logOut": function () {
        Meteor.logout()
    }
})