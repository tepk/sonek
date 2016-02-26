Template.closeIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
})

Template.closeIssue.onRendered(function () {

})

Template.closeIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    },

    issueActive: function () {
        return Issues.findOne(this._id).issueActive;
    }
})

Template.closeIssue.events({
    "submit #closeComment": function (e) {
        Issues.update(this._id, {
            $set: {
                closeComment: $('#comment').val(),
                issueActive: false
            }
        });
        return false;
    }
})