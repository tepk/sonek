Template.issueClosed.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
})

Template.issueClosed.onRendered(function () {

})

Template.issueClosed.helpers({
    issueClosed: function () {
        var currIssue = Issues.findOne(this._id)
        if (currIssue) {
            var closeComment = currIssue.closeComment
            console.log(this)
            return "Заявка закрыта. Выберите действие:"
        } else {
            Router.go('/')
            return false
        }
    }
})

Template.issueClosed.events({

})