Template.list.onCreated(function () {
    this.subscribe('recent_issues');
    this.subscribe('crew');
    Session.set("sort", "ticketNumber")
    Session.set("searchInput", "")

})

Template.list.onRendered(function () {

})

Template.list.helpers({
    members: function () {
        Session.get("sort")
        console.log(Session.get("sort"))
        var sget = {};
        sget[Session.get("sort")] = 1
        return Crew.find({lname: {$regex: Session.get("searchInput")}}, {sort: sget});
        },
    currMem: function() {
        return Crew.findOne({_id: Session.get("currMem")})
    },
    lsearch: function() {
        console.log(Crew.find({lname: Session.get("searchInput")}).fetch())
        return Crew.find({lname: Session.get("searchInput")}).fetch()
    },

    /* performer: function () {
        var crew = Crew.findOne({userId: this.performer});
        if (crew) {
            return crew.lname + " " + crew.fname;
        } else {
            return "всем"
        }
    }, */

    counter: function() {
        return Crew.find({lname: {$regex: Session.get("searchInput")}}).count();
    }
})

Template.list.events({
    "click .members": function (e) {
        $('.editContent').css("display", "block");
        Session.set("currMem", e.currentTarget.id)
        console.log(e.currentTarget.id)
    },
    "click .tnumber": function(e) {
        Session.set("sort", "tNumber")
    },
    "click .lname": function(e) {
        Session.set("sort", "lname")
    },
    "click .bdate": function(e) {
        Session.set("sort", "dBirth")
    },
    "click .section": function(e) {
        Session.set("sort", "section")
    },
    "click .closeCard": function() {
        $('.editContent').css("display", "none");
        $('.searchContent').css("display", "none");
    },
    "click .search": function() {
        Session.set("searchInput", $("#lsearch").val())
    },
    "click #localSearch": function() {
        $('.searchContent').css("display", "block");
    },
      "keyup #fastSearch": function() {
        var search = "^" + $('#fastSearch').val()
            Session.set("searchInput", search)
        console.log(search)
        console.log(Crew.find({lname: {$regex: search}}).fetch())
    },

    /* "keyup #passwordInput": function() {
        Session.set("passwordInput", $('#passwordInput').val())

        Meteor.loginWithPassword('admin', Session.get("passwordInput"), function (err) {
            if (err) {
                console.log('error')

                // toastr.error('Неверная пара логин/пароль', 'Ошибка');
            }
            // The user might not have been found, or their password
            // could be incorrect. Inform the user that their
            // login attempt has failed.
            else
                console.log('success')

            // toastr.success('Выполнен вход в систему', 'Выполнено');              // The user has been logged in.
        });
        return false;
    } */
})