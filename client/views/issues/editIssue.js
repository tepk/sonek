Template.editIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
    this.subscribe('crew');


})

Template.editIssue.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime:timeLogic,
        onShow:timeLogic
    });
    $.cleditor.defaultOptions.width = 790;
    this.$("#input").cleditor();


})

Template.editIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);

    }


})

Template.editIssue.events({
    "submit #editIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#input").val();
        if (!newTitle) {
            toastr.error('Поле &laquo;Заявленная неисправность&raquo; не может быть пустым', 'Ошибка');
            return false
        }

        Issues.update(this._id, {
            $set: {
                performer: $("#selector").val(),
                title: $("#issue").val(),                           // title
                message: $("#input").val(),                         // message
                createdAt: new Date,                                // creation timestamp
                assignDate: $("#datetimepicker").val(),
            }
        });
        Router.go('/viewIssue/' + $(e.currentTarget).attr("class"));
        return false;
    }
})