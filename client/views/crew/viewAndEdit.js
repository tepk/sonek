Template.viewAndEdit.onCreated(function () {
    this.subscribe('crew');

})

Template.viewAndEdit.onRendered(function () {

})

Template.viewAndEdit.helpers({
    data: function() {
        console.log(this._id)
        return Crew.findOne({_id: this._id})
    }

})

Template.viewAndEdit.events({
    "click #pay": function(e) {
        var paymentYear = parseInt($('#paymentYear').val(), 10)
        Payments.insert({
            payerId: this._id,
            paymentYear: paymentYear
        })
        console.log(this._id, + ' ' + paymentYear)
        e.preventDefault()

    },
    "click .print": function() {
        window.print()
        return false
    },
    "click #clickToView": function() {
        $('#viewCard').css({"display": "block"})
        $('#printCard').css({"display": "none"})
        $('#editCard').css({"display": "none"})
    },
    "click #clickToEdit": function() {
        $('#viewCard').css({"display": "none"})
        $('#printCard').css({"display": "none"})
        $('#editCard').css({"display": "block"})
    },
    "click #clickToPrint": function() {
        $('#viewCard').css({"display": "none"})
        $('#printCard').css({"display": "block"})
        $('#editCard').css({"display": "none"})
    }
})