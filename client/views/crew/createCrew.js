Template.createCrew.onCreated(function () {
    Session.set('mStatus', false);
    Session.set('alert', false);
    Session.set('photo', 'data:image/png;base64,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')
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
    },
    tempAvatar: function() {
        return Session.get('photo')
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
        var avatar = Session.get('photo')
        Crew.insert({
            photo: avatar,
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
                Session.set('photo', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABkCAYAAACSPo4tAAAIE0lEQVR42u2dZ1MUTRCA/f+fjYgREUyYAwKCQhkxIsEcKESCCggioI4+U29fzTss+Xa7j50PU4dxb+fZzj29O37//v0nLf3169evPzv++4VLS2/9A+GWlpZcgpFgpBXDYCUYSTLSSjCSmkorwUhqKq3NrgTDmHQkGMlmpFVqmyE3vLi4WHkSk2QoGshwWYJROgMuTx+SMT8/nwy4JgRZt2/fdg8fPvRQrEhIKdSUbDYb//37d3ft2jVXV1fnzp496+bm5kzB2PZqCgjfvn1zg4OD7tSpUx7Evn373OHDh93z588rMKwAqSkYsmmx6onXz58/3cjIiLt//767dOmSq6+v9yD2799f+bxx44abnZ01JR01ByNcoWeEUR4fH3cPHjxwFy9edM3NzX7TWcCIfz5y5IgHJq6uhfurWRhAwA68f//edXZ2uqNHj/qNliWbHy/5MyRkYGDAw0jeVMYGx79moxYWFryx/fr1q/v06ZN78eKFu3XrlmtqanJ79uzxmxoDCH8va8nfO3/+vFdp2pJhxpvKCsbYoM+fP7v+/n6v99va2vzmY3xZ8oRvdgkwFnYjwciAAQSe/q6uLnfmzBl34MCByuaHT/1WYYhBR7LwtrRhyENoQk3xZVBHSAKGNfR+ZONjKFuVDNbevXvdhw8fyg0jNMJ8AgJ1xOZs9YnfCAwB8vr1a9WIXFVNhUYaEL29vVVTPxuxGfKJJ4ZXJkC0VLUqDG6ep5LNqIZh3qx0AATP6suXL+WEwcUJ1G7evFnZnKJAZMUhYdxRdIpENTclN4r7evLkyaoZ5q14Vlz7+vXr/gEp2m6ou7Zc/O3bt8ueUk0Yhw4d8lF96WCgDl69eqUKIUtlTU1NLcsKbHsY6Mg3b964gwcPmoHBdxHJ0LAbqjAIuI4dO6YKIlykXMiDlTLOwIBT9NGGIJJx7tw5D6NUNkMuPjk56f17KzDwpn78+FFOb4ok3eXLl9VthgAh5hHXtmiboVoD50ZnZmb802gFxr1793x6plQGXG4UldDR0bEsQ6sBgnTMo0ePVNIhJmwG9QsaA6zAePLkiUoZ1gwM6tdWYPT19SUYa9Wsi1jAkF4qrVydKgyMJR6MFRhUGjVgmDDgVmBIxY8UupZkqNczQhjaWVtgIBliM4pOFKrC4KbphaL7z0IKHTVFP5b0URVdD1dVU+SA6IeyUM8ABJ/UMzgyELeRFhF9q7Z3UjdgE6SZTNt4y8NAh3rRp5vkeJs6DAup81AykQ6NZmhVNUVeSqMRYS0Y1Fc0zm2oGnAqatKMYEk6SOmXrtJHkrC9vd0MCLFdZG5LZcAlFfL06VMT0be4tqzh4WGVhgT1OIOzFtZshnSllwaGGEja/7Eb8TEvDRh8UgOXsmtpYIjriKq6c+eOCRjEF7QOhZ5UadRUeEhmdHTU7d69W81+nDhxwjdHaB0JkO539SMBkjCMD0gWaStoighr36U8EhAuRkhouLL8zKF9zQP64tCYOe06PT3tVVXRMHbu3Fk5ZKkJw8S4irDQdPr06UIMeejKEnFrGG0zamqlYSvUoCny5A1EJCMryNM6bGnm6LGIKXEHiboi0uoAOX78uEo7Z01MSKC1kmqb1DnyrmFIa06CsYKb+/LlS+/m5gVDVBTt/2NjYyam6pgc/iVROeXYvGwG/y+TF6xNYzM3/Eukg0M0nCLKy4viTAhnQywNjzQLg/QI5c+83FnmkkxMTKRJbOv5UiTsSNzlBYPBYLi0lmCYlAzW48ePq66mwtiloaHBOwpWYEjQa8qbktXd3e2NbF51C1Tgs2fPTMEwkw4JN4WfZeRpnnEGw2PkehY0gqlEYQiDlHae446k8UBrio75RCFfhsY2JnBS/sxTMvi/mfZG0BfWvEsf9IXjjjCs1Rx9tx5jzuQ3bdthDgYJu6InsQF9165dlc5zLRimZhRKuycDHGPPJ28YXJPuRs1I3Ew9Q1RUOGGn6PF4BJmaLzkxpaaQCoK8orpD4ilsLS0tqtJhBgZPJAdUijynEcOIg8BtB2OtSf5yQIQcEdU9zRmFFJouXLjg3erQmMfft2ZzU/Hs2niyPzfOeT7SHrIhmgMjRUKuXLnizxpmAclbQxQmGSTCCLAw1BLUhadcpUFAu/FZVOXVq1fdu3fvfCDKRuVZnq2amsp6euJuQRoNyMQCQSQhC4Zmr23WwqngZSjYE6L10OOqptTkBkNcVdbHjx/9OW86zYEQbv5q77fQBpIFiIJUT09PpUIYgzERZ2S99wJJ4ImSAlEWBCtzCdcbHIbpE7LK2LxqpVE2nSiMN1/I4qejY/FKwjnjK0lDLcCIW0Hj9zYxuIxXBcVnOjYqMRuCsdKFEFXmhw8NDfm093pUUa1AWM2ehL+PB9ba2uodE7wwUV9hs8NacDaUm8qCwIWZXEavagih1ja7moEjqplzimQUsuxKVWCEQBgzwRu/aHeRFEYtP/nVkhbZB+wkDguVxPDVc6vByPSmwr7XUNQgDAQak6XmsNIXK4tkZNVGYjCNjY1+Uk/4tsysITGrwgj/EYEaNoFXcJZ1w7fqieEWc7KXvczqYsyEEYLg8AqNwehBmVduYehKLcIQScHJ4ZSUSMqq3lTYmk+OBqNUqzGCJXsSqi6auuklJs0SelzLYEhrJYHNdnJPLcDIMvQSOGZ6U9AKPaS0ufkd6pQGbMzB/yRD7ET4VrAEI9/MMAvpkCGVHsY/CBUYci4iwSju5SnEbBVvKoSB0dYeHVGmRebi7t27FXv9F409tBn4Ny7YAAAAAElFTkSuQmCC')

            }))

        return false
    },
    "click #fileMenu": function() {
        $('input:file')[0].click()
        return
    },
    "change #uploadPhoto": function(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.currentTarget.files[0]);
        reader.onloadend = function() {
            base64data = reader.result;
            Session.set('photo', base64data)
            console.log(base64data);
        }
        console.log(e.currentTarget.files)
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
