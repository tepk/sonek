Template.createNew.onCreated(function () {

})

Template.createNew.onRendered(function () {

})

Template.createNew.helpers({
    data: function () {
        return this;
    }
})

Template.createNew.events({
    "submit #createIssue": function (e, t) {
        var newTitle = $("#issue").val();
        var newMessage = $("#issueComment").val();

        Issues.insert({

            title: $("#issue").val(),                           // title
            message: $("#issueComment").val(),                  // message
            createdAt: moment().format('HH:mm, DD MMMM YYYY')   // creation timestamp
        });
        console.log('it works!');
        Router.go('/');
        e.preventDefault();
        return false;
    }
})