Accounts.onCreateUser(function(options, user) {
   // user.profile.s=3;
    // console.log(options)
    Rules.insert({
        rule: options.profile.rule,
        userId: user._id
    })
    return user;
});