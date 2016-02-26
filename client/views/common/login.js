Template.login.onCreated(function () {

})

Template.login.onRendered(function () {

})

Template.login.helpers({
    data: function () {
        return this;
    }
})

Template.login.events({
    'submit #login-form' : function(e, t){
        e.preventDefault();
        // retrieve the input field values
        var username = t.find('#login-uname').value,
            password = t.find('#login-password').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(username, password, function(err){
            if (err) {
                toastr.error('Неверная пара логин/пароль', 'Ошибка');
            }
            // The user might not have been found, or their passwword
            // could be incorrect. Inform the user that their
            // login attempt has failed.
            else
                toastr.success('Выполнен вход в систему', 'Выполнено');              // The user has been logged in.
        });
        return false;
    }
})