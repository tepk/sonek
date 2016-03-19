Template.createNew.onCreated(function () {
    var self = this;
    this.subscribe('crew');
    this.subscribe('address');
    self.selectedDistrict = new ReactiveVar();
    self.autorun(function () {
        if (self.selectedDistrict.get()) {
            self.subscribe('addressByDistrict', self.selectedDistrict.get());
        }
    })
})

Template.createNew.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime: timeLogic,
        onShow: timeLogic
    });

    this.$("#input").cleditor();


})

Template.createNew.helpers({
    address: function () {
        console.log(Address.findOne({_id: Template.instance().selectedDistrict.get()}))
        return Address.findOne({_id: Template.instance().selectedDistrict.get()});
    },

    isDisabled: function () {
        return Template.instance().selectedDistrict.get() ? "" : "disabled"
    }
    /*,
     districts: function() {
     return Address.find({});
     } */
})

Template.createNew.events({
    "submit #createIssue": function (e) {
        var newTitle = $("#issue").val();
        var pnumber = $("#pnumber").val();
        if (!newTitle) {
            toastr.error('Поле &laquo;Заявленная неисправность&raquo; не может быть пустым', 'Ошибка');
            return false
        }
        if (!pnumber) {
            toastr.error('Поле &laquo;Номер телефона&raquo; не может быть пустым', 'Ошибка');
            return false
        }

        if (pnumber.length != 10) {
            toastr.error('Номер мобильного телефона должен содержать 10 цифр', 'Ошибка');
            return false
        }

        Issues.insert({
                performer: $("#selector").val(),
                districtId: $(".district-select").val(),            // district id
                address: $("#addressor").val(),                     // street
                hnumber: $(".house-number").val(),                  // house number
                pnumber: $("#pnumber").val(),                       // phone number
                title: $("#issue").val(),                           // title
                message: $("#input").val(),                         // message
                createdAt: new Date().getTime(),                    // creation timestamp
                issueActive: true,                                  // check, if issue closed
                assignDate: new Date($("#datetimepicker").val()),   // assign date and time
                createdBy: Meteor.userId(),                         // creator of an issue
            },
            function (err, id) {
                Router.go('/viewIssue/' + id);
            }
        );
        e.preventDefault();
    },
    "change .district-select": function (e, t) {
        console.log($(e.currentTarget).val())
        t.selectedDistrict.set($(e.currentTarget).val());
    }
})