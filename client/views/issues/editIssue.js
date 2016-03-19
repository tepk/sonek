Template.editIssue.onCreated(function () {
    var self = this;

    this.subscribe('recent_issues', this.data._id);
    this.subscribe('crew');
    this.subscribe('address');
    self.selectedDistrict = new ReactiveVar();
    self.autorun(function () {
        if (self.selectedDistrict.get()) {
            self.subscribe('addressByDistrict', self.selectedDistrict.get());
        }
    })

})

Template.editIssue.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime: timeLogic,
        onShow: timeLogic
    });
    Meteor.setTimeout(function () {
        $("#input").cleditor()
    }, 500);
    var self = this
    self.autorun(function () {
        var issue = Issues.findOne(self.data._id)
        if (issue) {
            self.selectedDistrict.set(issue.districtId);
        }
    });
})


Template.editIssue.helpers({

    data: function () {
        return Issues.findOne(this._id);
    },
    districtSelected: function (districtId) {
        var issue = Issues.findOne({
            _id: Template.parentData(1)._id
        })
        if (issue) {
            var currDistrict = issue.districtId
            if (currDistrict === this._id) {
                return "selected"
            }
        }

    },

    address: function () {
        return Address.findOne({_id: Template.instance().selectedDistrict.get()});
    },

    streetSelected: function () {
        console.log(this.toString())
        var pageId = Template.instance().data._id
        if (pageId) {
            var currStreet = Issues.findOne({_id: pageId}).address
            /* console.log(currStreet) */
        }


        if (this.toString() === currStreet)
            return "selected"

    },


    performerSelected: function (userId) {
        var currIssue = Issues.findOne(
            {
                _id: Template.parentData(1)._id
            }
        )
        if (currIssue) {
            var worker = Crew.findOne({userId: currIssue.performer})
            if (worker) {
                if (worker._id === this._id)
                    return "selected"
            }
        }
    }


})

Template.editIssue.events({
    "submit #createIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#input").val();
        if (!newTitle) {
            toastr.error('Поле &laquo;Заявленная неисправность&raquo; не может быть пустым', 'Ошибка');
            return false
        }

        Issues.update(this._id, {
            $set: {
                performer: $("#selector").val(),
                districtId: $(".district-select").val(),            // district id
                address: $("#addressor").val(),                     // street
                hnumber: $(".house-number").val(),                  // house number
                pnumber: $("#pnumber").val(),                       // phone number
                title: $("#issue").val(),                           // title
                message: $("#input").val(),                         // message
                issueActive: true,                                  // check, if issue closed
                assignDate: new Date($("#datetimepicker").val()),   // assign date and time
            }
        });

        Router.go('/viewIssue/' + this._id);
        e.preventDefault();
        return false;
    },
    "change .district-select": function (e, t) {

        t.selectedDistrict.set($(e.currentTarget).val());
        return false;
    }
})