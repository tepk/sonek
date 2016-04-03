Template.viewFeedback.onCreated(function () {
    this.subscribe('feedbackUnChecked');
    this.subscribe('feedback');
})

Template.viewFeedback.onRendered(function () {
    var self = this.data._id
    console.log(self)
    Feedback.update(self, {
        $set: {
            checked: true
        }
    })

})

Template.viewFeedback.helpers({
    feedbackMessage: function() {
        return Feedback.findOne(this._id)
    },
     timestamp: function () {
         var feed = Feedback.findOne(this._id)
         if (feed) {
            return moment(Feedback.findOne(this._id)).format("HH:mm, DD.MM.YYYY")
         }
     }

})

Template.viewFeedback.events({
    "click #inProgress": function () {
        Feedback.update(this._id, {
            $set: {
                inProgress: true
            }
        })
    }
})