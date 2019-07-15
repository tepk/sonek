Meteor.autorun(function () {
    var today = new Date().toISOString().substr(0, 10).substr(5, 5)
    var bArr = []
    var hasBirthdays = false
    bArr = Crew.find({dBirth: {$exists: true}}, {sort: {bParty: 1}}).fetch()
    bArr.forEach(function (v) {
        if (v.bParty >= today) {
            var bDate = new Date(new Date().getFullYear() + '-' + v.bParty).getTime()
            var currDate = new Date().getTime()
            if ((bDate - currDate) <= 604800000) {
                hasBirthdays = true
            }
        }
    })
    setTimeout(function(){
        if (hasBirthdays) {
            document.body.setAttribute('birthday-alert', 'true')
        } else {
            document.body.removeAttribute('birthday-alert')

        }
    }, 1000)

});

console.log('haha')