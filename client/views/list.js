Template.list.onCreated(function () {
    this.subscribe('recent_issues');
    this.subscribe('crew');
    Session.set("sort", "lname")
    Session.set("searchInput", "")
    Session.set('listPos', 0)

})

Template.list.onRendered(function () {


})

Template.list.helpers({
    members: function () {
        Session.get("sort")
        var sget = {};
        sget[Session.get("sort")] = 1
        var allMem = Crew.find({lname: {$regex: Session.get("searchInput")}}, {sort: sget}).fetch();
        var actMem = []
        var inactMem = []
        var currYear = new Date().getFullYear()
        allMem.forEach(function(v) {
            if ((Payments.find({payerId: v._id}, {sort: {paymentYear: -1}, limit: 1}).fetch()[0]) && (Payments.find({payerId: v._id}, {sort: {paymentYear: -1}, limit: 1}).fetch()[0].paymentYear >= currYear)) {
                actMem.push(v)
            } else {
                inactMem.push(v)
            }
        })
        if (Session.get('listPos') === 0) {
            console.log('Итого активных ' + (actMem.length))
            Session.set('counter', actMem.length)
            return actMem
        }
        if (Session.get('listPos') === 1) {
            console.log('Итого неаактивных ' + (inactMem.length))
            Session.set('counter', inactMem.length)
            return inactMem
        }
        else {
            Session.set('counter', allMem.length)
            console.log('Итого ' + (allMem.length))
            return allMem
        }
        //return Crew.find({lname: {$regex: Session.get("searchInput")}}, {sort: sget});

    },
    lsearch: function () {
        return Crew.find({lname: Session.get("searchInput")}).fetch()
    },
    cash: function () {
        var activePayment = Payments.find({payerId: this._id}, {sort: {paymentYear: -1}, limit: 1}).fetch()[0]
        var currentYear = new Date().getFullYear()
        if ((activePayment) && (activePayment.paymentYear >= currentYear)) {
            return true
        } else {
            return false
        }
    },
    currentPayment: function () {
        return Payments.find({payerId: this._id}, {sort: {paymentYear: -1}, limit: 1}).fetch()[0].paymentYear
    },
    list: function () {

        if (Session.get('listPos') === 0) {
            return 'активных'
        }
        if (Session.get('listPos') === 1) {
            return 'неактивных'
        }
        if (Session.get('listPos') === 2) {
            return 'всех'
        } else {
            Session.set('listPos', 0);
            return 'активных'
        }
    },

    counter: function () {
        return Session.get('counter')
        // return Crew.find({lname: {$regex: Session.get("searchInput")}}).count();
    }
})

Template.list.events({

    "click .tnumber": function (e) {
        Session.set("sort", "tNumber")
    },
    "click .lname": function (e) {
        Session.set("sort", "lname")
    },
    "click .bdate": function (e) {
        Session.set("sort", "dBirth")
    },
    "click .section": function (e) {
        Session.set("sort", "section")
    },
    "click .closeCard": function () {
        $('.editContent').css("display", "none");
        $('.searchContent').css("display", "none");
    },
    "click .search": function () {
        Session.set("searchInput", $("#lsearch").val())
    },
    "click #localSearch": function () {
        $('.searchContent').css("display", "block");
    },
    "keyup #fastSearch": function () {
        var search = "^" + $('#fastSearch').val()
        Session.set("searchInput", search)
    },

    "click .show": function () {
        Session.set('listPos', Session.get('listPos') + 1);
        if (Session.get('listPos') > 2) {
            Session.set('listPos', 0);
        }
    },

    "click .payment": function (e) {
        var paymentYear = new Date().getFullYear() + 1
        if (confirm('Подтвердить оплату за ' + paymentYear.toString() + ' год?')) {
            Payments.insert({
                payerId: this._id,
                paymentYear: paymentYear
            })
            toastr.success('Оплачен ' + paymentYear.toString() + ' год', 'Успешно');
        } else {
            return false
        }
    },
    "click .unpayment": function (e) {
        var paymentYear = new Date().getFullYear()
        if (confirm('Провести оплату за ' + paymentYear.toString() + ' год?')) {
            Payments.insert({
                payerId: this._id,
                paymentYear: new Date().getFullYear()
            })
            toastr.success('Оплачен ' + paymentYear.toString() + ' год', 'Успешно');
        } else {
            toastr.error('Оплата не проведена', 'Ошибка');
        }
    }

})