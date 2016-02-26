Template.createNew.onCreated(function () {
    this.subscribe('crew');
})

Template.createNew.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime:timeLogic,
        onShow:timeLogic


    });
})

Template.createNew.helpers({
})

Template.createNew.events({
    "submit #createIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#issueComment").val();
        if (!newTitle) {
            toastr.error('Поле &laquo;Заявленная неисправность&raquo; не может быть пустым', 'Ошибка');
            return false
        }

        Issues.insert({
            performer: $("#selector").val(),
            title: $("#issue").val(),                           // title
            message: $("#issueComment").val(),                  // message
            createdAt: new Date,                                // creation timestamp
            issueActive: true,                                  // check, if issue closed
            assignDate: $("#datetimepicker").val(),             // assign date and time
        },
            function (err, id) {
                Router.go('/viewIssue/' + id);
            }
        );
        e.preventDefault();
    }
})