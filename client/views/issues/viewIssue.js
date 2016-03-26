Template.viewIssue.onCreated(function () {
    var self = this;
    this.subscribe('currentIssue', this.data._id);
    this.subscribe('crew');
    this.subscribe('address');
    self.phoneNumber = new ReactiveVar();

})

Template.viewIssue.onRendered(function () {
    var self = this
    Meteor.setTimeout(function () {
        window.asd = $("#input").cleditor()
    }, 500);
})

Template.viewIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    },
    isAdmin: function () {
        var crew = Crew.findOne({userId: Meteor.userId()})
        if (crew) {
            return crew.isAdmin;
        }
    },

    issueActive: function () {
        var issue = Issues.findOne(this._id)
        if (issue) {
            return issue.issueActive;
        }
    },
    performer: function () {
        var issue = Issues.findOne(this._id)
        if (!issue)
            return
        var crew = Crew.findOne({
            userId: issue.performer
        });
        if (crew) {
            return crew.lname + " " + crew.fname;
        } else {
            return "всем"
        }
    },
    created: function () {
        var issue = Issues.findOne({_id: this._id});
        if (issue) {
            return moment(issue.createdAt).format("DD.MM.YYYY")
        }
    },
    phoneNumber: function () {
        return Template.instance().phoneNumber.get()
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
    },

    "click #showPhoneNumber": function (e, t) {
        Meteor.call('showPhoneNumber', this._id, globalUI.callback(function (result) {
                t.phoneNumber.set(result)
            })
        );
    }
})