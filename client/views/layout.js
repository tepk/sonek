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
    birthdays: function() {
        var today = new Date().toISOString().substr(0, 10).substr(5, 5)
        var bArr = []
        var nArr = []
        var oArr = []
        console.log(Crew.find().fetch())
        // console.log(Crew.find({dBirth: {$exists: true}}, {sort: {bParty: 1}}).fetch())
        bArr = Crew.find({dBirth: {$exists: true}}, {sort: {bParty: 1}}).fetch()
        bArr.forEach(function (v, i, a) {
            if (v.bParty >= today) {
                var bDate = new Date(new Date().getFullYear() + '-' + v.bParty)
                var currDate = new Date().getTime()
                if ((bDate - currDate) <= 604800000) {
                    $('.bday-alert').css("display", "inline-block")
                }
            }
        })
    }
})

Template.layout.events({
        "click #logout": function(e) {
            console.log('click ' + e)
            Meteor.logout()
            e.preventDefault()

        }
})