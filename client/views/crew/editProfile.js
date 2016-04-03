Template.editProfile.onCreated(function () {
    this.subscribe('crew');
})

Template.editProfile.onRendered(function () {
    this.$("#datetimepicker").datetimepicker({
        onChangeDateTime: timeLogic,
        onShow: timeLogic
    });
    this.$("#cstmrday").datetimepicker({
        onChangeDateTime: timeLogic,
        onShow: timeLogic
    });

    var self = this;
    console.log(self.data)
    self.uploadTag = $.cloudinary.unsigned_upload_tag("l35vvwy7");
    self.$("#uploadImage").append(this.uploadTag);
    self.uploadTag.on('cloudinarydone', function (e, data) {
        var profileAvatar = "3"
        Crew.update({_id: self.data._id}, {
            $set: {avatar: data.result}
        })
    }).on('cloudinaryprogress', function (e, data) {
        // console.log(e, data)
        // TODO progress
    });
    console.log(this.data);
})

Template.editProfile.helpers({
    profile: function () {
        return Crew.findOne(this._id)
    },
    rgstrday: function () {
        return moment(Crew.findOne(this._id).registeredAt).format("DD.MM.YYYY")
    },
    brthday: function () {
        return moment(Crew.findOne(this._id).brthday).format("YYYY-MM-DD")
    },
    cstmrday: function () {
        return moment(Crew.findOne(this._id).cstmrday).format("YYYY-MM-DD")
    }
})

Template.editProfile.events({
    "submit #editProfile": function (e, t) {
        Crew.update(this._id, {
            $set: {
                lname: $(".lname").val(),
                fname: $(".fname").val(),
                sname: $(".sname").val(),
                brthday: new Date($("#datetimepicker").val()),
                cstmrday: new Date($("#cstmrday").val())
            }
        }),
        Router.go('/viewProfile/' + this._id);
        return false;
    }
})