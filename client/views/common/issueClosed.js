Template.issueClosed.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
})

Template.issueClosed.onRendered(function () {

})

Template.issueClosed.helpers({
    issueClosed: function () {
        var currIssue = Issues.findOne(this._id)
        if (currIssue) {
            return "Заявка закрыта. Выберите дайствие:"
        } else {
            return "Заявка удалена, либо не существует"
        }
    }
})

Template.issueClosed.events({

})