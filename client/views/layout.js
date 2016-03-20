Template.layout.onCreated(function () {
    this.subscribe('crew');
})

Template.layout.onRendered(function () {

})

Template.layout.helpers({
    loggedIn: function () {
        var fio = Crew.findOne({userId: Meteor.userId()});
        if (fio) {
            return fio.lname + " " + fio.fname;
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