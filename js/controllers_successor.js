/*
 *
 *  This  file  is part of  the digital testament   management program
 *                           DigiProof.
 *
 *  By  accessing  this  software,  DigiProof, you are  duly  informed
 *  of and agree to be bound by the conditions described below in this
 *  notice:
 *
 *  This software product,  DigiProof,  is  developed by T. Linden and
 *  copyrighted  (C)  2013  by  T. Linden,   with all rights reserved.
 *
 *  There is no charge for  DigiProof software.  You can  redistribute
 *  it  and/or modify  it  under the terms  of the GNU  General Public
 *  License, which is incorporated by reference herein.
 *
 *  DigiProof is distributed WITHOUT ANY WARRANTY, IMPLIED OR EXPRESS,
 *  OF MERCHANTABILITY  OR FITNESS  FOR A  PARTICULAR PURPOSE  or that
 *  the use of it will not infringe on any third party's  intellectual
 *  property rights.
 *
 *  You should  have received a copy of the GNU General Public License
 *  along with DigiProof. Copies can also be obtained from:
 *
 *    http://www.gnu.org/licenses/gpl-2.0.html
 *
 *  or by writing to:
 *
 *    Free Software Foundation, Inc.
 *    Inc., 51 Franklin Street, Fifth Floor
 *    Boston, MA 02110-1301
 *    USA
 *
 *  Or contact:
 *
 *    "T. Linden" <tlinden@cpan.org>
 *
 *  The sourcecode can be found on:
 *
 *    https://github.com/TLINDEN/digiproof
 *
 */





// manage successors: create, edit and delete them.
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

