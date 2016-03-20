Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.route('/', {name: 'list'});
Router.route('/createNew', {name: 'createNew'});
Router.route('/createCrew', {name: 'createCrew'});
Router.route('/viewCrew', {name: 'viewCrew'});

Router.route('/viewIssue/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('viewIssue', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'viewIssue'});

Router.route('/editIssue/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('editIssue', {
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
