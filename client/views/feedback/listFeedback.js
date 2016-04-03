Template.listFeedback.onCreated(function () {
    this.subscribe('feedbackUnChecked');
})

Template.listFeedback.onRendered(function () {

})

Template.listFeedback.helpers({
    feedbackIssue: function() {
        var feeds = Feedback.find()
        return feeds
    },
    timeStamp: function () {
        var tmstmp = Feedback.findOne(this._id).timeStamp
        if (tmstmp) {
            return moment(tmstmp).format("DD.MM.YYYY, HH:mm")
        }
    }
})

Template.listFeedback.events({

})