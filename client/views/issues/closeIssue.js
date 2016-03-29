Template.closeIssue.onCreated(function () {
    this.subscribe('currentIssue', this.data._id);

})

Template.closeIssue.onRendered(function () {
    Meteor.setTimeout(function () {
        $("#input").cleditor()
    }, 500);
})

Template.closeIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    },

    issueActive: function () {
        var issue = Issues.findOne(this._id);
        if (issue) {
            return issue.issueActive;
        }
    }
})

Template.closeIssue.events({
    "submit #createIssue": function (e) {
        Issues.update(this._id, {
            $set: {
                closeComment: $('#input').val(),
                issueActive: false
            }
        });
        return false;
    },
    "click #closeIssue": function (e) {
        if (confirm('Вы действительно хотите удалить заявку? Это действие нельзя отменить')) {
            Issues.remove({_id: this._id})
        } else {
            return false
        }
    }
})