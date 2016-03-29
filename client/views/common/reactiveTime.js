Meteor.setInterval(function () {
    Session.set("reactiveTime", new Date().getTime())
}, 10000)
