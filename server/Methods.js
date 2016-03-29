Meteor.methods({
    showPhoneNumber: function (_id) {
        var currIssue = Issues.findOne(_id);
        if (currIssue) {
            return currIssue.pnumber
        }
        throw new Meteor.Error("no issue found", "there is no issue/issue._id");


    }
})
