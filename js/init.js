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

// just the app object. put ember.js tuning, logging etc here.
App = Ember.Application.create({
    //LOG_TRANSITIONS: true
});


/*
 * Some trickery for help popovers:
 * make sure, only one popover appears at a time.
 * if the user hovers over another help button,
 * hide other popovers and display the new. Hide
 * all if not above a help button at all.
 */
$(document).ready(function () {  
    $('.popup-marker').popover({
	html: true,
	trigger: 'hover'
    }).click(function(e) {
	$('.popup-marker').not(this).popover('hide');
	$(this).popover('toggle');
    });
    $(document).click(function(e) {
	if (!$(e.target).is('.popup-marker, .popover-title, .popover-content')) {
            $('.popup-marker').popover('hide');
	}
    });
});

