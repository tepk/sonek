Accounts.onCreateUser(function(options, user) {
   // user.profile.s=3;
    // console.log(options)
    Crew.insert({
        fname: options.profile.fname,
        sname: options.profile.sname,
        lname: options.profile.lname,
        isAdmin: options.profile.isAdmin,
        group: options.profile.group,
        userId: user._id
    })
    return user;
});