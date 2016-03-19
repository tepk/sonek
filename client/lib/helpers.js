Template.registerHelper("crew", function () {
    return Crew.find();
})

Template.registerHelper("districts", function () {
    return Address.find();
})

Template.registerHelper("parseDate", function(date) {
    return moment(date).format("YYYY-MM-DD HH:mm");
})