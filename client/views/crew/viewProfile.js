Template.viewProfile.onCreated(function () {
    this.subscribe('crew');

})

Template.viewProfile.onRendered(function () {
    var self = this;
    console.log(self.data)
    self.uploadTag = $.cloudinary.unsigned_upload_tag("l35vvwy7");
    self.$("#uploadImage").append(this.uploadTag);
    self.uploadTag.on('cloudinarydone', function (e, data) {
        Crew.update({_id: self.data._id}, {
                $set: {avatar: data.result}
            })
    }).on('cloudinaryprogress', function (e, data) {
        console.log(e, data)
        //TODO progress
    });
    console.log(this.data);

})

Template.viewProfile.helpers({
    data: function () {

        return Crew.findOne(this._id);
    },
    registerDate: function () {
        return moment(Crew.findOne({_id: this._id}).registeredAt).format("DD.MM.YYYY")
    },

    isAdmin: function () {
        if (Crew.findOne(this._id).isAdmin) {
            return "администратор"
        } else {
            return "выездной инженер"
        }
    },
    userPic: function () {
        var avatar = Crew.findOne(this._id).avatar
        if (avatar) {
            console.log(avatar)
            return true
        }
    }

})

Template.viewProfile.events({
    'submit form': function (e, t) {
        // Prevent default actions
        e.preventDefault();

        var files = []
        var file = $('#userPic')[0].files[0];
        files.push(file)
        console.log(files)
        Cloudinary.upload(file, function (err, res) {

            console.log("Upload Error: " + err);
            console.log("Upload Result: " + res);
        });
    }
})