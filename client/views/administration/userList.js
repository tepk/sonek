Template.userList.onCreated(function() {
    this.subscribe('userlist');
    this.subscribe('rules');
})

Template.userList.onRendered(function() {
    console.log('rendered')
})

Template.userList.helpers({
    showUserlist: function() {
        return Meteor.users.find({}, {sort: {username: 1}}).fetch()
    },
    rule: function() {
        return Rules.findOne({userId: this._id})
    },
    current: function() {
        return Meteor.users.findOne({_id: Meteor.userId()})
    },
    isAdmin: function() {
        if (Rules.findOne({userId: Meteor.userId()}).rule == "administrator") {
            return true
        } else {
            return false
        }
    }
})

Template.userList.events({
    "submit #createNewUser": function(e) {
        e.preventDefault()
        Accounts.createUser({username: $("#newUsername").val(), password: $("#newUserpassword").val(), profile: {rule: 'user'}})
        $('#createNewUser').trigger("reset")
    },
    "click #userAddButton": function() {
        $("#userAdd").css("display", "block")
    }
})
