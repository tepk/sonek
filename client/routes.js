Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.route('/', {name: 'list'});
Router.route('/createCrew', {name: 'createCrew'});
Router.route('/birthDays', {name: 'birthDays'});
Router.route('/userList', {name: 'userList'});
Router.route('/viewNedit/:_id', function () {
        var params = this.params;
        var id = params._id;
        this.render('viewAndEdit', {
            data: function () {
                return {_id: this.params._id};
            }
        });
},
    {name: 'viewAndEdit'});

Router.route('/viewIssue/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('viewIssue', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'viewIssue'});

Router.route('/viewCrew/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('viewCrew', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'editIssue'});

Router.route('/closeIssue/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('closeIssue', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'closeIssue'});
