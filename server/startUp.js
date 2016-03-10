Meteor.startup(function () {
    var addr = Address.find({}).count();
    if (addr <=0) {
        console.log(addr)
        var streets = Assets.getText('address.json')
        streets = JSON.parse(streets)
        streets.forEach(function (doc) {
            Address.insert(doc)
        })
    } else {
        console.log('db is filled')
    }


})


