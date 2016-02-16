Template.list.onCreated(function () {
    this.subscribe('recent_issues');
})

Template.list.onRendered(function () {

})

Template.list.helpers({
    issues: function () {
        return Issues.find({}, {sort: {createdAt: 1}});
    }
})

Template.list.events({

})