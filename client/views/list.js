Template.list.onCreated(function () {
    this.subscribe('recent_issues');
})

Template.list.onRendered(function () {

})

Template.list.helpers({
    issues: function () {
        return Issues.find({}, {sort: {createdAt: -1}});
    }
})

Template.list.events({
    'click .viewIssue': function (e) {
        console.log('/viewIssue/' + $(e.currentTarget).attr("_id"));
        Router.go('/viewIssue/' + $(e.currentTarget).attr("_id"));
    }
})