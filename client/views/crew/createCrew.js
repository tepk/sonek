Template.createCrew.onCreated(function () {

})

Template.createCrew.onRendered(function () {

})

Template.createCrew.helpers({
    data: function () {
        return this;
    }
})

Template.createCrew.events({
    "submit #createCrew": function (e, t) {

        var username = $("#username").val(),
            password = $("#setPassword").val(),
            checkPassword = $("#checkPassword").val()
            if (password !== checkPassword) {
                toastr.error('Пароли не совпадают', 'Ошибка');
                return false
            }
            if (password.length < 6 || password.length > 12) {
                toastr.error('Длина пароля должна быть не&nbsp;менее 6&nbsp;и&nbsp;не&nbsp;более 12&nbsp;символов', 'Ошибка');
                return false
            }

        Accounts.createUser({
                username: username, password: password, profile: {
                    fname: $("#fname").val(),                    //first name
                    sname: $("#sname").val(),                    //second name
                    lname: $("#lname").val(),                    //last name
                    group: $("#group").val(),                    //user group
                    isAdmin: false
                }
            },
            globalUI.callback(function(){
                toastr.success('Пользователь создан', 'Выполнено');
                e.currentTarget.reset()
            })
        )

        return false
    }
})
