Template.listFeedback.onCreated(function () {
    this.subscribe('feedbackUnChecked');
})

Template.listFeedback.onRendered(function () {

})

Template.listFeedback.helpers({
    feedbackIssue: function() {
        var feeds = Feedback.find()
        return feeds
    }
})

Template.listFeedback.events({

})