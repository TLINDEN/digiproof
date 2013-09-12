



App.SuccessorsSuccessorController = Ember.ObjectController.extend({
    isEditing: false,
    errors: {},

    edit: function() {
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
    },

    remove: function() {
	var successor = this.get('model');
	successor.deleteRecord();
	successor.get("store").commit();
	this.get("target").transitionTo("successors");
    }
});

App.SuccessorsNewController = Ember.ArrayController.extend({
    newName: '',
    next: 0,
    erros: {},

    createNextSuccessor: function () {
	this.set('next', 1);
	this.createSuccessor();
    },

    createSuccessor: function () {
	var successor = App.Successor.createRecord({
	    name:     this.get('name'),
	    address:  this.get('address'),
	    birth:    this.get('birth'),
	    name2:    this.get('name2'),
	    address2: this.get('address2'),
	    birth2:   this.get('birth2')
	});

	var validated =  successor.validate();
	//console.log("validated: %o", validated);
	if(! validated.valid) {
	    successor.deleteRecord();
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
	else {
	    // Save the new model
	    successor.get("store").commit();

	    // empty form fields so new entries starts from scratch
	    this.set('name',     '');
	    this.set('address',  '');
	    this.set('birth',    '');
	    this.set('name2',    '');
	    this.set('address2', '');
	    this.set('birth2',   '');
	    
	    if(this.get('next') == 1) {
		this.get("target").transitionTo("successors.new");
	    }
	    else {
		// redirect to newly created entry
		this.get("target").transitionTo("successors.successor", successor);
	    }
	}
  }
});

