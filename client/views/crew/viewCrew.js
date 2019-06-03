Template.viewCrew.onCreated(function () {

})

Template.viewCrew.onRendered(function () {

})

Template.viewCrew.helpers({
    data: function() {
        return Crew.findOne({_id: this._id})
    }

})

Template.viewCrew.events({

})