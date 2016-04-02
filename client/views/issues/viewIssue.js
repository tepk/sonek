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
    districtBerdsk: function () {
        var currIssue =  Issues.findOne(this._id);
        if (currIssue) {
            var district = Address.findOne({_id: currIssue.districtId})
            if (district) {
                if (district.district == "г. Бердск") {
                    return (district.district + ", ")
                } else {
                    return  (district.district + " район, ")
                }
            }
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
    },
    fireIssue: function () {
        var issue = Issues.findOne(this._id);
        if (issue) {
            var currAssignDate = issue.assignDate.getTime()
            var currTime = Session.get("reactiveTime")
            if (((currAssignDate - currTime) <= 7200000) && ((currAssignDate - currTime) > 0)) {
                return "Внимание! Срок актуальности заявки истекает меньше чем через 2 часа!"
            }
            if ((currAssignDate - currTime) <= 0) {
                return "Внимание! Срок актуальности истек. Заявка может быть неактуальной."
            }
        }
    },
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