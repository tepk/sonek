Template.createNew.onCreated(function () {
    this.subscribe('crew');
    this.subscribe('address');
})

Template.createNew.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime: timeLogic,
        onShow: timeLogic
    });
    $.cleditor.defaultOptions.width = 790;
    this.$("#input").cleditor();



})

Template.createNew.helpers({
        address: function () {

        return Address.find({}, {sort: {address: 1}});

    }
})

Template.createNew.events({
    "submit #createIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#input").val();
        if (!newTitle) {
            toastr.error('Поле &laquo;Заявленная неисправность&raquo; не может быть пустым', 'Ошибка');
            return false
        }

        Issues.insert({
                performer: $("#selector").val(),
                address: $("#addressor").val(),
                title: $("#issue").val(),                           // title
                message: $("#input").val(),                         // message
                createdAt: new Date,                                // creation timestamp
                issueActive: true,                                  // check, if issue closed
                assignDate: $("#datetimepicker").val(),             // assign date and time
                createdBy: Meteor.userId(),                         // creator of an issue
            },
            function (err, id) {
                Router.go('/viewIssue/' + id);
            }
        );
        e.preventDefault();
    }
})