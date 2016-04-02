Template.layout.onCreated(function () {
    this.subscribe('crew');
    this.subscribe('feedbackUnChecked');
})

Template.layout.onRendered(function () {

})

Template.layout.helpers({
    loggedIn: function () {
        var fio = Crew.findOne({userId: Meteor.userId()});
        if (fio) {
            return fio.lname + " " + fio.fname;
        }
    },
    feedbackUnChecked: function () {
        var count = Feedback.find({checked: false}).count();
        if ((count) && (count > 0)) {
            return count
        }
    }
})

Template.layout.events({
    "click .logOut": function () {
        console.log('click')
        Meteor.logout();
        return false;
    }
})