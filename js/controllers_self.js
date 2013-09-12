
App.SelfController = Ember.ObjectController.extend({
    isEditing: false,
    errors: {},

    edit: function() {
	// prepare order to the actual object, not id
	this.set('isEditing', true);
    },

    doneEditing: function() {
	var validated =  this.get('model').validate();
	if(! validated.valid) {
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
	else {
	    this.set('isEditing', false);
	    this.get('model').get("store").commit();
	}
    },

    cancelEditing: function() {
	this.set('isEditing', false);
    }
});

