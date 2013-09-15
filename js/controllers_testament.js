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
 * plain simple controller, just spits out all our
 * data, the acual testament generation happens in the
 * template
 */
App.TestamentController = Ember.ArrayController.extend({
    needs: "self",
    //self: Ember.computed.alias("controllers.self"),
    successors: App.Successor.find(),
    self: App.Self.find(0),
    now: new Date(),
    notempty: CheckForEmptyDB()
});

