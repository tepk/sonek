Template.birthDays.onCreated(function () {

})

Template.birthDays.onRendered(function () {

})

Template.birthDays.helpers({
    data: function() {
        var today = new Date().toISOString().substr(0, 10).substr(5, 5)
        var bArr = []
        var nArr = []
        var oArr = []
        bArr = Crew.find({dBirth: {$exists: true}}, {sort: {bParty: 1}}).fetch()
        bArr.forEach(function(v, i, a) {
            if (v.bParty >= today){
                var bDate = new Date(new Date().getFullYear() + '-' + v.bParty)
                var currDate = new Date().getTime()
                if ((bDate - currDate) <= 604800000) {
                nArr.push(v)
                console.log(nArr)
                }
            }
        })
        oArr.forEach(function(v) {
            nArr.push(v)
        })
        return nArr
    },
    age: function() {
        var currAge = (new Date().getFullYear() - parseInt(Crew.findOne({_id: this._id}).hDate.substr(6, 4), 10))
        if ((currAge >= 5) && (currAge <= 20)) {
            currAge = currAge + ' лет'
        } else {
            var stringEnd = parseInt((currAge / 10).toString().split('.')[1], 10)
            if ((stringEnd >= 2) && (stringEnd < 5)) {
                currAge = currAge + ' года'
            }
            if (stringEnd == 1) {
                currAge = currAge + ' год'
            }
            if ((stringEnd == 0) || (!stringEnd) || ((stringEnd >= 5) && (stringEnd <= 9))) {
                currAge = currAge + ' лет'
            }
        }
        console.log(currAge)
        return currAge
    }


})

Template.birthDays.events({

})