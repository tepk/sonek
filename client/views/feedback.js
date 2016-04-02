Template.feedback.onCreated(function () {

})

Template.feedback.onRendered(function () {
    Meteor.setTimeout(function () {
        $("#input").cleditor()
    }, 500);
})

Template.feedback.helpers({})

Template.feedback.events({
    "submit .feedback": function (e, t) {
        var currUser = Meteor.userId();         //if user loggedIn
        var email = $("#email").val();          //e-mail
        var message = $("#input").val();        //message
        if (!email) {
            toastr.error('Поле &laquo;Электронный адрес&raquo; не может быть пустым', 'Ошибка');
            return false
        }
        if (!message) {
            toastr.error('Сообщение не может быть пустым', 'Ошибка');
            return false
        }
        if (currUser) {
            Feedback.insert({
                creator: currUser,
                email: email,
                message: message,
                timeStamp: new Date(),
                checked: false,
                inProgress: false,
                fixed: false
            })
        } else {
            Feedback.insert({
                    email: email,
                    message: message,
                    timeStamp: new Date(),
                    checked: false,
                    inProgress: false,
                    fixed: false
                })
        }
        alert('Ваше обращение отправлено администрации');
        Router.go('/');
        return false;
    }
})