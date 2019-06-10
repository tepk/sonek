Template.payments.onCreated(function () {
    this.subscribe('payments');
    this.subscribe('crew');
})

Template.payments.onRendered(function () {

})

Template.payments.helpers({
    payers: function () {
        var payersList = Crew.find({})
        payersList.forEach(function(v) {
            console.log(Payments.find({payerId: v._id}, {sort: {payentYear: -1}, limit: 1}).fetch())
        })
        return Crew.find({});
    }

})

Template.payments.events({

})