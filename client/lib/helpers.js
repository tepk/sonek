Template.registerHelper("crew", function () {
    return Crew.find();
})

Template.registerHelper("payments", function () {
    return Payments.find();
})

Template.registerHelper("districts", function () {
    console.log(Address.find())
    return Address.find();
})