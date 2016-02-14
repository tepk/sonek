Template.viewIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
    console.log(this.data._id);
})

Template.viewIssue.onRendered(function () {

})

Template.viewIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    }
})

Template.viewIssue.events({

})