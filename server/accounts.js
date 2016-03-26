Accounts.onCreateUser(function(options, user) {
   // user.profile.s=3;
    // console.log(options)
    Crew.insert({
        fname: options.profile.fname,           //имя
        sname: options.profile.sname,           //отчество
        lname: options.profile.lname,           //фамилия
        avatar: options.profile.avatar,         //юзерпик
        isAdmin: options.profile.isAdmin,       //является ли администратором
        group: options.profile.group,           //группа пользователя
        userId: user._id,                       //id в базе аккаунтов
        pnumber: user.username,                 //номер телефона
        profileCompleted: false,                //заполнен ли профайл
        registeredAt: new Date().getTime()      //дата регистрации в системе
    })
    return user;
});