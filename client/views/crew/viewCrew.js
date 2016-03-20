Template.viewCrew.onCreated(function () {
    this.subscribe('crew');
})

Template.viewCrew.onRendered(function () {

})

Template.viewCrew.helpers({
    recentCrew: function () {
        var currCrew = Crew.find({}).fetch()
        return currCrew
    },
    estpGroup: function() {
        var isEstp = Crew.findOne({_id: this._id}).group
        console.log(isEstp)
        if (isEstp == "estpGroup") {
            return "estpGroup"
        }
    }
})

Template.viewCrew.events({

})