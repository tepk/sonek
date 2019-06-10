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
    "click #pay": function(e) {
        var paymentYear = parseInt($('#paymentYear').val(), 10)
        Payments.insert({
            payerId: this._id,
            paymentYear: paymentYear
        })
        console.log(this._id, + ' ' + paymentYear)
        e.preventDefault()

    }
})