Template.createCrew.onCreated(function () {

})

Template.createCrew.onRendered(function () {

})

Template.createCrew.helpers({
    data: function () {
        return this;
    }
})

Template.createCrew.events({
    "submit .new_post": function (e, t) {
        return false;
    }
})