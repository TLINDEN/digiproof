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
 * handlebars helper to translate strings.
 * Those are defined in js/locale.js, see there. Called with
 * {{loc _tag}} from any handlebars template.
 *
 * See https://gist.github.com/tracend/3261055
 */
Ember.Handlebars.registerBoundHelper('loc', function(keyword, options) {
    // pick the right dictionary
    var locale = window.locale[lang] || window.locale['en-US'];

    // loop through all the key hierarchy (if any)
    var target = locale;
    
    //console.log("key: %o", [keyword, options.data.properties[0]]);
    var key;
    if(keyword) {
	key = keyword;
    }
    else {
	key = options.data.properties[0];
    }
    keyword = '';
    options.data.properties[0] = '';

    if(key) {
	if(key in locale) {
	    return locale[key];
	}
	else {
	    return '__UNTRANSLATED_STRING__(' + key + ')';
	}
    }
    else {
	return '';
    }
});

// print a nice formatted date to the testament printout
Ember.Handlebars.registerBoundHelper('date', function(date) {
    moment().lang(lang);
    return moment(date).format('LL');
});

