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
 * Router for all links/uris in the app
 */
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

/*
 * the Self controller operates on one instance
 * only, since there are not many "selfes" required.
 */
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
