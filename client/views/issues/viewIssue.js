Template.viewIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
    this.subscribe('crew');
    this.subscribe('address');
})

Template.viewIssue.onRendered(function () {

})

Template.viewIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    },

    issueActive: function () {
        return Issues.findOne(this._id).issueActive;
    },
    performer: function () {
        var crew = Crew.findOne({
            userId: Issues.findOne({_id: this._id}).performer
        });
        if (crew) {
            return crew.lname + " " + crew.fname;
        }
    },
    creator: function () {
        var creator = Crew.findOne({
            userId: Issues.findOne({_id: this._id}).createdBy
        });
        if (creator) {
            return creator.lname + " " + creator.fname;

        }

    },
    address: function () {

        return Address.findOne({_id: Issues.findOne({_id: this._id}).address}).street
    }
})

Template.viewIssue.events({
    "click #editIssue": function (e) {
        Router.go('/editIssue/' + $(e.currentTarget).attr("class"));
        return false;
    },

    "click #closeIssue": function (e) {
        Router.go('/closeIssue/' + $(e.currentTarget).attr("class"));
        return false;
    },

    "click #resumeIssue": function (e) {
        Issues.update(this._id, {
            $set: {
                issueActive: true
            }
        });
        return false;
    }
})