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
 * Ember.js store for our app. We're using localstorage,
 * which is disabled in the production version though.
 */
App.store = DS.Store.createWithMixins({
    revision: 12,
    adapter: DS.LSAdapter.create({
	namespace: 'digiproof'
    }),
    init: function() {
	/*
	 * initialize some default objects for successor and order.
	 * the latter cannot be maintained by the user (as of now).
	 *
	 * FIXME: put the strings into js/locale.js.
	 */
	this._super();
	this.loadMany(App.Import,[ { 'id': 0, 'importdata': '' }]);
	if(lang === 'de') {
	    this.loadMany(App.Order,
			  [
			      { 'id': 0, 'name': 'weiter zu betreiben' },
			      { 'id': 1, 'name': 'zu kündigen'            },
			      { 'id': 2, 'name': 'zu übertragen'          },
			      { 'id': 3, 'name': 'nach Gutdünken abzuwickeln' },
			  ]
			 );
	    this.loadMany(App.Successor, [{ 'id': 0, 'name': 'Mein(e) regulären Erbe(n)' }]);
	}
	else {
	    this.loadMany(App.Order,
			  [
			      { 'id': 0, 'name': 'maintain'       },
			      { 'id': 1, 'name': 'liquidate'      },
			      { 'id': 2, 'name': 'transfer'       },
			      { 'id': 3, 'name': 'decide herself' },
			  ]
			 );
	    this.loadMany(App.Successor, [{ 'id': 0, 'name': 'My regular legal succesor(s)' }]);
	}
	// commit the objects so that reverse relations get properly saved
	this.commit();
    }
});
