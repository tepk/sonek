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
    "submit #createIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#issueComment").val();

        Issues.insert({
            performer: $("#selector").val(),
            title: $("#issue").val(),                           // title
            message: $("#issueComment").val(),                  // message
            createdAt: new Date,                                // creation timestamp
            issueActive: true,                                  // check, if issue closed

        },
            function (err, id) {
                console.log(id)
                Router.go('/viewIssue/' + id);
            }
        );
        e.preventDefault();
    }
})