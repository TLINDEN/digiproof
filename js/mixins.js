App.SelfMixin = Ember.Mixin.create({
    passwdset: null,

    /*
    didLoad: function() {
	this._passwdset();
    },

    didUpdate: function() {
	this.didLoad();
    },
    */

    validate: function() {
	var valid = true;
	var errors = {valid: true};
	if(! this.get('password')) {
	    errors.password = translate('_error_password');
	    errors.valid = false;
	}
	if(! this.get('name')) {
	    errors.name = translate('_error_name');
	    errors.valid = false;
	}
	if(! this.get('birth')) {
	    errors.birth = translate('_error_birth');
	    errors.valid = false;
	}
	if(! this.get('address')) {
	    errors.address = translate('_error_address');
	    errors.valid = false;
	}
	return errors;
    },

    haspasswd: function() {
	var p = this.get('password');
	if(p) {
	    return true;
	}
	else {
	    return false;
	}
    }.property()
});

App.ImportMixin = Ember.Mixin.create({
    validate: function() {
	var valid = true;
	var errors = {valid: true};
	if(! this.get('password')) {
	    errors.password = translate('_error_password');
	    errors.valid = false;
	}
	return errors;
    }
});

App.SuccessorMixin = Ember.Mixin.create({
    validate: function() {
	var valid = true;
	var errors = {valid: true};
	if(! this.get('name')) {
	    errors.name = translate('_error_name');
	    errors.valid = false;
	}
	return errors;
    }
});

App.AssetMixin = Ember.Mixin.create({
    validate: function() {
	var orderid;
	var successorid;
	var errors = {valid: true};
	try {
	    orderid = this.get('order').get('id');
	}
	catch (e) {	}
	try {
	    successorid = this.get('successor').get('id');
	}
	catch (e) {	}
	//console.log("got o: %o, s: %o", orderid, successorid);
	if(! orderid) {
	    errors.order = translate('_error_order');
	    errors.valid  = false;
	}
	if(! successorid) {
	    errors.successor = translate('_error_successor');
	    errors.valid  = false;
	}
	return errors;
    }
});
