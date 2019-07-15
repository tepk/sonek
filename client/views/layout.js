Template.layout.onCreated(function () {
    this.subscribe('crew');
    this.subscribe('payments');
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
    isAdmin: function () {
        /* console.log(Crew.findOne({userId: Meteor.userId()}).isAdmin)
        return Crew.findOne({userId: Meteor.userId()}).isAdmin */
        return true
    },

})

Template.layout.events({
        "click #logout": function(e) {
            console.log('click ' + e)
            Meteor.logout()
            e.preventDefault()

        }
})