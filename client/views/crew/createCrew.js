Template.createCrew.onCreated(function () {
    Session.set('mStatus', false);
    Session.set('alert', false);
})

Template.createCrew.onRendered(function () {

})

Template.createCrew.helpers({
    guessNumber: function () {
        if (Crew.find({}, {sort: {tNumber: -1}, limit: 1}).fetch()[0]) {
            return Crew.find({}, {sort: {tNumber: -1}, limit: 1}).fetch()[0].tNumber + 1
        } else {
            return
        }
    },
    today: function() {
        var fullDate = new Date().toISOString().substr(0, 10)
        return fullDate
    }
})

Template.createCrew.events({
    "submit #createMember": function (e, t) {

        var tNumber = $("#tNumber").val(),
            lname = $("#lname").val(),
            dBirth = $("#dBirth").val()

        if (Crew.findOne({tNumber: tNumber})) {
            toastr.error('Билет с таким номером уже существует', 'Ошибка');
            return false
        }
            if ((!tNumber) || (tNumber === '')) {
                toastr.error('Необходимо внести номер членского билета', 'Ошибка');
                return false
            }
            if ((!lname) || (lname === "")) {
                toastr.error('Необходимо внести фамилию члена', 'Ошибка');
                return false
            }
            if ((!dBirth) || (dBirth === '')) {
                toastr.error('Необходимо внести дату рождения', 'Ошибка');
                return false
            }


        /* Accounts.createUser({
                username: username, password: password, profile: {
                    fname: $("#fname").val(),                    //first name
                    sname: $("#sname").val(),                    //second name
                    lname: $("#lname").val(),                    //last name
                    isAdmin: false
                }
            },
            globalUI.callback(function(){
                toastr.success('Пользователь создан', 'Выполнено');
                e.currentTarget.reset()
            })
        ) */
        var tnumberString = $("#tNumber").val()
        var tnumberInt = Number(tnumberString)
        var mStatus = Session.get('mStatus')
        var alert = Session.get('alert')
        Crew.insert({
            tNumber: tnumberInt,
            dCreated: $("#dCreated").val(),
            dBirth: $("#dBirth").val(),
            lname: $("#lname").val(),
            fname: $("#fname").val(),
            job: $("#job").val(),
            section: $("#section").val(),
            position: $("#position").val(),
            aDegree: $("#aDegree").val(),
            address: $("#address").val(),
            email: $("#email").val(),
            mStatus: mStatus,
            alert: alert,
            pnumber: $("#pnumber").val(),
            speciality: $("#speciality").val(),
            bParty: $('#dBirth').val().substr(5, 5),
            hDate: $('#dBirth').val().substr(8, 2) + '.' + $('#dBirth').val().substr(5, 2) + '.' + $('#dBirth').val().substr(0, 4)
        },
            globalUI.callback(function(){
                toastr.success('Карточка члена клуба добавлена', 'Выполнено');
                e.currentTarget.reset()
            }))

        return false
    },
    "click #fileMenu": function() {
        $('input:file')[0].click()
        return
    },
    "change #uploadPhoto": function(e) {
        console.log(e.currentTarget.files[0].size)
    },
    "click #mStatus": function(e) {
        Session.set('mStatus', e.currentTarget.checked)
        console.log(e.currentTarget.checked)
    },
    "click #alert": function(e) {
        Session.set('alert', e.currentTarget.checked)
        console.log(e.currentTarget.checked)
    },
})
