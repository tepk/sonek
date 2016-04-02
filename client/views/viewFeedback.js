Template.viewFeedback.onCreated(function () {
    this.subscribe('feedbackUnChecked');
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

Template.viewFeedback.helpers({})

Template.viewFeedback.events({})