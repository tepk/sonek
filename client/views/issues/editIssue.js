Template.editIssue.onCreated(function () {
    this.subscribe('recent_issues', this.data._id);
    console.log(this.data._id);
})

Template.editIssue.onRendered(function () {

})

Template.editIssue.helpers({
    data: function () {
        return Issues.findOne(this._id);
        console.log(this._id)

    }
})

Template.editIssue.events({
    "submit #editIssue": function (e) {
        var newTitle = $("#issue").val();
        var newMessage = $("#issueComment").val();

        Issues.update(this._id, {
            $set: {
                performer: $("#selector").val(),
                title: $("#issue").val(),                           // title
                message: $("#issueComment").val(),                  // message
                createdAt: new Date,                                // creation timestamp
                issueClosed: false                                  // mark issue unclosed
            }
        });
        console.log('it works!');
        Router.go('/viewIssue/' + $(e.currentTarget).attr("class"));
        e.preventDefault();
        return false;
    }
})