Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', {name: 'list'});
Router.route('/createNew', {name: 'createNew'});
Router.route('/viewIssue/:_id', function () {
	var params = this.params;
	var id = params._id;
	this.render('viewIssue', {
		data: function () {
			return {_id: this.params._id};
		}
	});

}, {
	name: "viewIssue"
});
