Template.list.onCreated(function () {
    var self = this;
    /* this.subscribe('recent_issues'); */
    this.subscribe('crew');
    this.subscribe('address');
    self.selectedDistrict = new ReactiveVar();
    self.autorun(function () {
        self.subscribe('recent_issues', self.selectedDistrict.get());
    })

})

Template.list.onRendered(function () {

})

Template.list.helpers({
    issues: function () {
        if (Session.get("hideCompleted")) {

            var currDay = new Date()

            return Issues.find({issueActive: true, assignDate: {$gt: currDay}}, {sort: {assignDate: 1}});
        } else {
            return Issues.find({}, {sort: {assignDate: 1}});
        }
    },

    fireIssue: function () {
        var issue = Issues.findOne(this._id);
        if (issue) {
            if (issue.issueActive) {
                var currAssignDate = issue.assignDate.getTime()
                var currTime = Session.get("reactiveTime")
                if (((currAssignDate - currTime) <= 7200000) && ((currAssignDate - currTime) > 0)) {
                    return "fire"
                }
                if ((currAssignDate - currTime) <= 0) {
                    return "burn"
                }
            }
        }
    },

    hideCompleted: function () {
        return Session.get("hideCompleted");
    },

    issueActive: function () {
        var currIssue = Issues.findOne({_id: this._id})
        var today = new Date().getTime()
        if (currIssue) {

            if (currIssue.issueActive) {
                return "active"
            } else {
                return "inactive"
            }
        }
    },

    districtName: function () {
        var districtId = Address.findOne({_id: this.districtId});
        if (districtId) {
            return districtId.district
        } else {
            return "n/a"
        }

    },
    performer: function () {
        var crew = Crew.findOne({userId: this.performer});
        if (crew) {
            return crew.lname + " " + crew.fname;
        } else {
            return "всем"
        }
    }
})

Template.list.events({
    "change #hideCompleted input": function (event) {
        Session.set("hideCompleted", event.target.checked);
    },
    "click .logOut": function () {
        Meteor.logout()
    },
    "change .district-select": function (e, t) {
        console.log($(e.currentTarget).val())
        t.selectedDistrict.set($(e.currentTarget).val());
    }
})