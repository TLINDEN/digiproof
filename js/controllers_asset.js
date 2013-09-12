

App.AssetsAssetController = Ember.ObjectController.extend({
    isEditing: false,
    orders: App.Order.find(),
    errors: {},

    edit: function() {
	// prepare order to the actual object, not id
	this.set('isEditing', true);
	this.set('successors', App.Successor.find());
    },

    doneEditing: function() {
	var validated =  this.get('model').validate();
	if(validated.valid){
	    this.set('isEditing', false);
	    this.get('model').get("store").commit();
	}
	else {
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
    },

    cancelEditing: function() {
	this.set('isEditing', false);
    },

    remove: function() {
	var asset = this.get('model');
	asset.deleteRecord();
	asset.get("store").commit();
	this.get("target").transitionTo("assets");
    }
});

App.AssetsNewController = Ember.ArrayController.extend({
    successors: App.Successor.find(),
    orders: App.Order.find(),
    next: 0,
    selected_successor: 0,
    selected_order: 0,
    errors: {},
    

    createNextAsset: function () {
	this.set('next', 1);
	this.createAsset();
    },

    createAsset: function () {
	var name = this.get('name');
	if (!name.trim()) { return; }
	//console.log("successor: %o", this.get('order'));

	var asset = App.Asset.createRecord({
	    name:      name,
	    uri:       this.get('uri'),
	    login:     this.get('login'),
	    password:  this.get('password'),
	    mail:      this.get('mail'),
	    successor: this.get('successor'),
	    order:     this.get('order'),
	    notes:     this.get('notes')
	});

	var validated =  asset.validate();
	//console.log("validated: %o", validated);
	if(! validated.valid) {
	    asset.deleteRecord();
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
	else {
	    // Save the new model
	    asset.get("store").commit();

	    // empty form fields so new entries starts from scratch
	    this.set('name',     '');
	    this.set('uri',      '');
	    this.set('login',    '');
	    this.set('password', '');
	    this.set('mail',     '');
	    this.set('order',    '');
	    this.set('successor','');
	    this.set('notes',    '');

	    if(this.get('next') == 1) {
		this.get("target").transitionTo("assets.new");
	    }
	    else {
		// redirect to newly created entry
		this.get("target").transitionTo("assets.asset", asset);
	    }
	}
  }
});


