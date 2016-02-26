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
    loggedIn: function () {
        var fio = Crew.findOne({userId: Meteor.userId()});
        if (fio) {
            return fio.lname + " " + fio.fname;
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
    "click .hideComplete": function () {
        console.log(this.checked)
    },
    "click .logOut": function () {
        Accounts.logout()
    }
})