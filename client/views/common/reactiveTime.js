Meteor.setInterval(function () {
    Session.set("reactiveTime", new Date().getTime())
}, 60000)
