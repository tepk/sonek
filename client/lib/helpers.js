Template.registerHelper("crew", function () {
    return Crew.find();
})

Template.registerHelper("districts", function () {
    return Address.find();
})

Template.registerHelper("parseDate", function (date) {
    return moment(date).format("YYYY-MM-DD HH:mm");
})

Template.registerHelper("isAdmin", function (_id) {
    console.log(Crew.findOne({userId: Meteor.userId()}).isAdmin)
    return Crew.findOne({userId: Meteor.userId()}).isAdmin
})