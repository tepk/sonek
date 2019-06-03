Meteor.startup(function () {
    var addr = Address.find({}).count();
    var admin = Rules.findOne({rule: "administrator"});
    if (!admin) {
        console.log('First launch. Use admin/Just4Fun to log in')
        Accounts.createUser({
                username: "admin", password: "Just4Fun", profile: {
                    rule: "administrator"
                }
            })
    } else {
        console.log('admin already exists')
    }
    if (addr <=0) {
        console.log(addr)
        var streets = Assets.getText('package.json')
        streets = JSON.parse(streets)
        Object.keys(streets).forEach(function (doc) {
            var obj = {district: doc, streets: streets[doc]}
            Address.insert(obj)
        })
    } else {
        console.log(addr)
    }



})


