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

Router.route('/viewProfile/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('viewProfile', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'viewProfile'});

Router.route('/editProfile/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('editProfile', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'editProfile'});

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

Router.route('/feedback', {name: 'feedback'});
Router.route('/listFeedback', {name: 'listFeedback'});



Router.route('/viewFeedback/:_id', function () {
    var params = this.params;
    var id = params._id;
    this.render('viewFeedback', {
        data: function () {
            return {_id: this.params._id};
        }
    });

}, {name: 'viewFeedback'});