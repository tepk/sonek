Template.viewIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
    console.log(this.data._id);
})

Template.viewIssue.onRendered(function () {

})

Template.viewIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    },

    issueActive: function () {
        return Issues.findOne(this._id).issueActive;
    }
})

Template.viewIssue.events({
    "click #editIssue": function (e) {
        console.log('it works!');
        Router.go('/editIssue/' + $(e.currentTarget).attr("class"));
        e.preventDefault();
        return false;
    }
})

Template.viewIssue.events({
    /* "click #closeIssue": function (e) {
        console.log(Issues.findOne({_id: this._id}).issueActive);
        Issues.update(this._id, {
            $set: {
                issueActive: false
            }
        });
        e.preventDefault();
        return false;
    }, */
    "click #closeIssue": function(e) {
        Router.go('/closeIssue/' + $(e.currentTarget).attr("class"));
        e.preventDefault();
        return false;
    },

    "click #resumeIssue": function (e) {
        console.log(Issues.findOne({_id: this._id}).issueActive);
        Issues.update(this._id, {
            $set: {
                issueActive: true
            }
        });
        e.preventDefault();
        return false;
    }
})