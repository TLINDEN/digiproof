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



var attr = DS.attr;

App.Order = DS.Model.extend({
    name:     attr('string')
});

App.Self = DS.Model.extend(App.SelfMixin, {
    name:      attr('string'),
    address:   attr('string'),
    birth:     attr('string'),
    password:  attr('string'),
    toJson: function() {
	return JSON.stringify({
	    name: this.get('name'),
	    address: this.get('address'),
	    birth: this.get('birth')
	});
    }.property()
});


App.Import = DS.Model.extend(App.ImportMixin, {
    importdata: attr('string'),
    password:   attr('string')
});



App.Successor = DS.Model.extend(App.SuccessorMixin, {
    name:      attr('string'),
    address:   attr('string'),
    birth:     attr('string'),
    name2:     attr('string'),
    address2:  attr('string'),
    birth2:    attr('string'),
    assets: DS.hasMany('App.Asset', {
	inverse: 'successor'
    }),
    toJson: function() {
	return JSON.stringify({
	    id: this.get('id'),
	    name: this.get('name'),
	    address: this.get('address'),
	    birth: this.get('birth'),
	    name2: this.get('name2'),
	    address2: this.get('address2'),
	    birth2: this.get('birth2')
	});
    }.property(),
    has_assets: function() {
	var has = false;
	var assets = this.get('assets');
	has = assets.forEach(function(asset) {
	    return true;
	});
	return has;
    }.property()
});


App.Asset = DS.Model.extend(App.AssetMixin, {
    name:     attr('string'),
    uri:      attr('string'),
    login:    attr('string'),
    password: attr('string'),
    mail:     attr('string'),
    order:    DS.belongsTo('App.Order'),
    notes:    attr('string'),
    successor: DS.belongsTo('App.Successor'),
    toJson: function() {
	var orderid = "0";
	var successorid = "0";
	try {
	    orderid =  this.get('order').get('id');
	}
	catch (e) {}
	try {
	    successorid =  this.get('successor').get('id');
	}
	catch (e) {}
	return JSON.stringify({
	    id: this.get('id'),
	    name: this.get('name'),
	    uri: this.get('uri'),
	    login: this.get('login'),
	    password: this.get('password'),
	    mail: this.get('mail'),
	    notes: this.get('notes'),
	    order: orderid,
	    successor: successorid
	});
    }.property()
});

