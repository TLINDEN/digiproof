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


/*
 * Those mixins will be used to extend our models
 * see models.js. In general we add validators,
 * which will be called on edit or save of an instance.
 */
App.SelfMixin = Ember.Mixin.create({
    passwdset: null,

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
