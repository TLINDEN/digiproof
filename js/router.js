
App.Router.map(function() {
    this.resource('assets', function() {
	this.route('asset', { path: ':asset_id' });
	this.route('new');
    });

    this.resource('successors', function() {
	this.route('successor', { path: ':successor_id' });
	this.route('new');
    });

    this.route('self');

    this.route('testament');

    this.route('about');

    this.resource('data', function() {
	this.route('export');
	this.route('import');
    });
});


App.AssetsRoute = Ember.Route.extend({
  model: function() {
    return App.Asset.find();
  }
});

App.SelfRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', App.Self.find(0));
  }
});

App.DataImportRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', App.Import.find(0));
  }
});


App.SuccessorsRoute = Ember.Route.extend({
  model: function() {
    return App.Successor.find();
  }
});
