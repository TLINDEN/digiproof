
App = Ember.Application.create({
    //LOG_TRANSITIONS: true
});

var attr = DS.attr;

App.SelfMixin = Ember.Mixin.create({
    passwdset: null,

    /*
    didLoad: function() {
	this._passwdset();
    },

    didUpdate: function() {
	this.didLoad();
    },
    */

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

App.Import = DS.Model.extend(App.ImportMixin, {
    importdata: attr('string'),
    password:   attr('string')
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


var lang = (navigator.language) ? navigator.language : navigator.userLanguage;

App.store = DS.Store.createWithMixins({
    revision: 12,
    adapter: DS.LSAdapter.create({
	namespace: 'digiproof'
    }),
    init: function() {
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
    }
});



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

    this.resource('data', function() {
	this.route('export');
	this.route('import');
    });
});


App.IndexController = Ember.Controller.extend({
    has_self:      App.Self.find(),
    has_asset:     App.Asset.find(),
    has_successor: App.Successor.find(),
    VERSION: VERSION
});

function CheckForEmptyDB() {
    var assets = App.Asset.find();
    var notempty = true;
    notempty = assets.forEach(function(asset) {
        return false;
    });
    return notempty;
}

/*
  FIXME: checking for self.name doesnt work because
         of delayed exec it returns null even if the
	 name is set.
function CheckForEmptyDB() {
    var assets = App.Asset.find();
    var self   = App.Self.find(0);
    var noassets = true;
    var noself   = true;
    noassets = assets.forEach(function(asset) {
	return false;
    });
    console.log("a: %o, s: %o", noassets, noself);
    console.log("name: %s", self.get('name'));
    if(self.get('name')) {
	noself = false;
    }
    console.log("a: %o, s: %o", noassets, noself);
    if(noassets && noself) {
	return false;
    }
    else {
	return true;
    }
}
*/

App.TestamentController = Ember.ArrayController.extend({
    needs: "self",
    //self: Ember.computed.alias("controllers.self"),
    successors: App.Successor.find(),
    self: App.Self.find(0),
    now: new Date(),
    notempty: CheckForEmptyDB()
});


App.DataExportController = Ember.ArrayController.extend({
    successors: App.Successor.find(),
    self:       App.Self.find(0),
    assets:     App.Asset.find(),
    download: function() {
	var raw = $('#rawdata').text();
	//console.log("raw: %o", raw);
	var blob = new Blob([raw], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "digiproof-export.txt");
    }
});
/*
	successors.forEach(function(successor) {
	    doc.text(20, line, utf2latin(successor.get('name')));
	    line += 10;
	});
*/

App.AssetsRoute = Ember.Route.extend({
  model: function() {
    return App.Asset.find();
  }
});

App.SelfRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', App.Self.find(0));
  }
});

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

App.DataImportRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', App.Import.find(0));
  }
});


// Convert hex string to ASCII.
// See http://stackoverflow.com/questions/11889329/word-array-to-string
function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function decryptimport(pass, data) {
    var enpass = CryptoJS.SHA512(pass).toString(CryptoJS.enc.Base64);
    var clear = CryptoJS.AES.decrypt(data, enpass);
    return unescape(hex2a(clear.toString()));
}

// from:
// http://ntt.cc/2008/01/19/base64-encoder-decoder-with-javascript.html
function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    var keyStr = "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef" +
        "ghijklmnopqrstuv" +
        "wxyz0123456789+/" +
        "=";

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g; //
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
	
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
	
    } while (i < input.length);
    
    return unescape(output);
}

var UploadedImport = null;
App.UploadFileView = Ember.TextField.extend({
    // WARN: this one gets fired as soon as the user selected a file
    //       that is, before the submit button got clicked
    type: 'file',
    attributeBindings: ['name'],
    change: function(evt) {
	var self = this;
	var input = evt.target;
	if (input.files && input.files[0]) {
            var reader = new FileReader();
            var that = this;
            reader.onload = function(e) {
		var fileToUpload = e.srcElement.result;
		UploadedImport = decode64(fileToUpload.split(',')[1]);
            }
            reader.readAsDataURL(input.files[0]);
	}
    }
});

App.DataImportController = Ember.ObjectController.extend({
    isEditing: true,
    clear: '',
    errors: {},

    doneEditing: function() {
	var validated =  this.get('model').validate();

	// decrypt and reload models
	if(validated.valid) {
	    this.set('isEditing', false);
	    pass = this.get('password');

	    try {
		var entries = '';
		if(UploadedImport) {
		    //console.log("using upload");
		    entries = UploadedImport.match(/[^\r\n]+/g);
		    UploadedImport = null;
		}
		else if (this.get('importdata')) {
		    //console.log("using input");
		    entries = this.get('importdata').match(/[^\r\n]+/g);
		}
		else {
		    throw 'No import data provided';
		}
		//console.log("got %d entries: %o", entries.length, entries);
		var json    = '';
		for (var i = 0; i < entries.length; i++) {
		    var importline = entries[i].split(',');
		    //console.log("splitted: %o", importline);
		    if(importline[0] === 'asset') {
			//console.log("import asset");
			json = decryptimport(pass, importline[1]);
			if(json) {
			    //console.log("evaluating: %s", json);
			    var obj = JSON.parse(json);
			    //console.log("code: %o", obj);
			    var exists = App.Asset.all().some(function(asset) {
				return asset.get('id') === obj.id;
			    });
			    if(exists) {
				/* update
				   FIXME: Updating doesn't work yet for some unknown reason
				App.Asset.find(obj.id).then(function(asset) {
				    asset.set("name", obj.name);
				    asset.set("uri", obj.uri);
				    asset.set("login", obj.login);
				    asset.set("password", obj.password);
				    asset.set("mail", obj.mail);
				    asset.set("successor", App.Successor.find(obj.successor));
				    asset.set("order", App.Order.find(obj.order));
				    asset.set("notes", obj.notes);
				});
				*/
			    }
			    else {
				// create
				var asset =  App.Asset.createRecord({
				    id:        obj.id,
				    name:      obj.name,
				    uri:       obj.uri,
				    login:     obj.login,
				    password:  obj.password,
				    mail:      obj.mail,
				    successor: App.Successor.find(obj.successor),
				    order:     App.Order.find(obj.order),
				    notes:     obj.notes
				});
			    }
			}
			else {
			    throw 'decrypted variable $json doesnt contain anything, weird';
			}
		    }
		    else if (importline[0] === 'successor') {
			console.log("import successor");
			json = decryptimport(pass, importline[1]);
			console.log("evaluating: %s", json);
			if(json) {
			    var obj = JSON.parse(json);
			    if(obj.id !== "0") {
				var exists = App.Successor.all().some(function(successor) {
				    return successor.get('id') === obj.id;
				});
				if(! exists) {
				    var successor =  App.Successor.createRecord(obj);
				}
			    }
			    else {
				//console.log("ignoring id 0");
			    }
			}
			else {
			    throw 'decrypted variable $json doesnt contain anything, weird';
			}
		    }
		    else if (importline[0] === 'self') {
			console.log("import self");
			json = decryptimport(pass, importline[1]);
			console.log("evaluating: %s", json);
			if(json) {
			    var obj = JSON.parse(json);
			    var self = App.Self.find(0).then(function(self) {
				//console.log("didLoad on self fired, putting %o with pass %s", obj, pass);
				self.set('name',     obj.name);
				self.set('birth',    obj.birth);
				self.set('address',  obj.address);
				self.set('password', pass);
			    });
			}
			else {
			    throw 'decrypted variable $json doesnt contain anything, weird';
			}
		    }
		    /*
		      else {
		      console.log("import unknown");
		      }
		    */
		}
	        App.store.commit();
		this.set('clear', translate('_importdone'));
	    }
	    catch (e) {
		console.log("decryption exception: %o", e);
		this.set('clear', translate('_error_decrypt') + " (" + e + ")");
	    }
	}
	else {
	    // no password given
	    this.set('isEditing', true);
	    this.set('errors', validated);
	    this.set('clear', translate('_error_decrypt'));
	}
    },

    repeatEditing: function() {
	this.set('isEditing', true);
	this.set('importdata', '');
	this.set('password', '');
    }
});

App.AssetsAssetController = Ember.ObjectController.extend({
    isEditing: false,
    orders: App.Order.find(),
    errors: {},

    edit: function() {
	// prepare order to the actual object, not id
	this.set('isEditing', true);
	this.set('successors', App.Successor.find());
    },

    doneEditing: function() {
	var validated =  this.get('model').validate();
	if(validated.valid){
	    this.set('isEditing', false);
	    this.get('model').get("store").commit();
	}
	else {
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
    },

    cancelEditing: function() {
	this.set('isEditing', false);
    },

    remove: function() {
	var asset = this.get('model');
	asset.deleteRecord();
	asset.get("store").commit();
	this.get("target").transitionTo("assets");
    }
});

App.AssetsNewController = Ember.ArrayController.extend({
    successors: App.Successor.find(),
    orders: App.Order.find(),
    next: 0,
    selected_successor: 0,
    selected_order: 0,
    errors: {},
    

    createNextAsset: function () {
	this.set('next', 1);
	this.createAsset();
    },

    createAsset: function () {
	var name = this.get('name');
	if (!name.trim()) { return; }
	//console.log("successor: %o", this.get('order'));

	var asset = App.Asset.createRecord({
	    name:      name,
	    uri:       this.get('uri'),
	    login:     this.get('login'),
	    password:  this.get('password'),
	    mail:      this.get('mail'),
	    successor: this.get('successor'),
	    order:     this.get('order'),
	    notes:     this.get('notes')
	});

	var validated =  asset.validate();
	//console.log("validated: %o", validated);
	if(! validated.valid) {
	    asset.deleteRecord();
	    this.set('errors', validated);
	    this.set('isEditing', true);
	}
	else {
	    // Save the new model
	    asset.get("store").commit();

	    // empty form fields so new entries starts from scratch
	    this.set('name',     '');
	    this.set('uri',      '');
	    this.set('login',    '');
	    this.set('password', '');
	    this.set('mail',     '');
	    this.set('order',    '');
	    this.set('successor','');
	    this.set('notes',    '');

	    if(this.get('next') == 1) {
		this.get("target").transitionTo("assets.new");
	    }
	    else {
		// redirect to newly created entry
		this.get("target").transitionTo("assets.asset", asset);
	    }
	}
  }
});




App.NavView = Ember.View.extend({
    tagName: 'li',
    classNameBindings: 'active'.w(),

    didInsertElement: function () {
        this._super();
        var _this = this;
        this.get('parentView').on('click', function () {
            _this.notifyPropertyChange('active');
        });
    },

    active: function () {
        return this.get('childViews.firstObject.active');
    }.property()
});






App.SuccessorsRoute = Ember.Route.extend({
  model: function() {
    return App.Successor.find();
  }
});

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

window.locale = {
    "en-US": {
	"_successors": "Legal Successors",
	"_successor": "Legal Successor",
	"_addsuccessor": "Add Legal Successor",
	"_substitute": "Substitute Successor",
	"_assets": "Network Assets",
	"_asset": "Network Asset",
	"_addasset": "Network Asset",
	"_add": "add",
	"_name": "Name",
	"_uri": "URI",
	"_login": "Login/ID",
	"_pass": "Password",
	"_mail": "Mail",
	"_ordered": "is ordered to",
	"_preordered": "The successor is ordered to",
	"_postordered": "the asset",
	"_save": "Save",
	"_savenext": "Save and add another",
	"_cancel": "Cancel",
	"_remove": "Remove",
	"_edit": "Edit",
	"_notes": "Special Notes",
	"_address": "Address",
	"_birth": "Birth Date",
	"_testament": "View Testament",
	"_print": "This is the complete digital testament.",
	"_doprint": "Print it",
	"_ttitle": "My Digital Testament",
	"_appoint1": "I, ",
	"_appoint2": ", being of sound mind and disposing memory, hereby appoint the following person as my legal "
	           +"successor for the listed network assets after my death:",
	"_appoint3": "If the above person doesn't live anymore or cannot be "
	    +"found, this shall be the replacement legal successor:",
	"_selftitle": "Information about yourself",
	"_self": "Yourself",
	"_place": "Place",
	"_date": "Date",
	"_sign": "Signature",
	"_welcome": "Welcome to DigiProof",
	"_intro": "You can use DigiProof to generate a digital testament. "
	    +"Enter your data, print it out, sign it and hand it to your solicitor.",
	"_fill": "Data you have to enter",
	"_fill_self": "Personal information about yourself",
	"_fill_successor": "Information about your legal successor(s)",
	"_fill_asset": "Information about network assets (logins, passwords)"
	    +" and how the successor has to handle it",
	"_enterself": "Enter data about yourself",
	"_entersuccessor": "Enter successors",
	"_enterasset": "Enter network assets",
	"_has_self": "You already entered data about yourself",
	"_has_no_self": "You didn't yet enter data about yourself",
	"_has_successor": "You already entered one or more successors",
	"_has_no_successor": "You didn't yet enter any succesor",
	"_has_asset": "You already entered one or more network assets",
	"_has_no_asset": "You didn't yet enter yet any network assets",
	"_data": "Manage Data",
	"_export": "Export Data",
	"_import": "Import Data",
	"_exporthelp": "Copy the contents of the box into a textfile "
	    +"and save that somewhere. You can use it later to restore "
	    +"informations:",
	"_importdone": "Data imported",
	"_importhelp": "Paste previously exported data in here to restore your informations",
	"_successorsindex": "This is the list of your legal successors. You may add one or "
	    +"more persons but you can leave it out as well. In this case the regular lawful successor "
	    +"will be responsible for your network assets. The regular successor is the person or "
	    +"persons you appoint in your official testament or are appointed by law according to "
	    +"legal order of succession.",
	"_assetsindex": "This is the list of your network assets. A network asset is usually "
	    +"an account on a website, email accounts, social network account or webhosting credentials. "
	    +"Specify as much detail of the resource as possible so that your successor will be "
	    +"able to properly manage it after your death.",
	"_error_address": "Address required",
	"_error_birth": "Birth date required",
	"_error_name": "Name required",
	"_error_password": "Password required",
	"_dataindex": "Maintain your data, save it for future uses and restore it from previous backups",
	"_importpass": "Import password",
	"_error_decrypt": "Failed to decrypt imported data",
	"_error_order": "Select an order",
	"_error_successor": "Select a legal successor",
	"_importagain": "Import again",
	"_download": "Save data to disk",
	"_up_file": "Or, import from a previously exported file",
	"_up_select": "Select Importfile",
	"_up_change": "Change",
	"_up_remove": "Remove",
	"_successorshall": "My legal successor shall maintain the following network assets "
	    +"as ordered per asset.",
	"_nopasswd": "No personal password has been set. Go to the 'Yourself' settings, "
	    +"enter one and then come back here",
	"_testamentempty": "You have not entered any network assets and no legal successor, therefore you cannot print a testament yet. Start here: "
    },

    "de": {
	"_successors": "Rechtsnachfolger",
	"_successor": "Rechtsnachfolger",
	"_addsuccessor": "Rechtsnachfolger Hinzufügen",
	"_substitute": "Ersatzrechtsnachfolger",
	"_assets": "Netzaccounts",
	"_asset": "Netzaccount",
	"_addasset": "Netzaccount hinzufügen",
	"_add": "neu",
	"_name": "Bezeichnung",
	"_uri": "URL",
	"_login": "Benutzername",
	"_pass": "Passwort",
	"_mail": "E-Mail",
	"_ordered": "wird beauftragt",
	"_preordered": "Der Rechtsnachfolger wird beauftragt, den Netzaccount",
	"_postordered": "",
	"_save": "Speichern",
	"_savenext": "Speichern und Fortfahren",
	"_cancel": "Abbrechen",
	"_edit": "Bearbeiten",	
	"_remove": "Entfernen",
	"_notes": "Besondere Hinweise",
	"_birth": "Geburtsdatum",
	"_testament": "Testament Anschauen",
	"_address": "Adresse",
	"_print": "Dies ist das vollständige digitale Testament.",
	"_doprint": "Ausdrucken",
	"_ttitle": "Mein digitales Testament",
	"_appoint1": "Hiermit bestimme ich, ",
	"_appoint2": ", im Vollbesitz meiner geistigen Kräfte, die folgende Person als Rechtsnachfolger "
	    +"für die aufgeführten Netzwerkaccounts nach meinem Tode:",
	"_appoint3": "Falls die oben aufgeführte Person nicht mehr leben sollte "
	    +"oder unauffindbar sein, so soll dies der Ersatzrechtsnachfolger "
            +"sein:",
	"_successorshall": "Mein Rechtsnachfolger soll sich um die im folgenden "
	    +"aufgelisteten Netzaccounts den dabeistehenden Anweisungen entsprechend "
	    +"kümmern.",
	"_selftitle": "Angaben über Sie",
	"_self": "Eigene Angaben",
	"_place": "Ort",
	"_date": "Datum",
	"_sign": "Unterschrift",
	"_welcome": "Willkommen bei DigiProof",
	"_intro": "Sie können DigiProof verwenden, um ein digitales Testament "
	+"zu erstellen. Machen Sie Ihre Angaben, drucken Sie das Testament aus,"
	    +"unterschreiben Sie es und hinterlegen Sie es bei Ihrem Notar.",
	"_fill": "Erforderliche Angaben",
	"_fill_self": "Persönliche Angaben über Sie selbst",
	"_fill_successor": "Informationen über Ihre(n) Rechtsnachfolger (Erbe)",
	"_fill_asset": "Informationen über Netzwerkaccounts (Benutzernamen, "
	    +"Passwörter) und wie Ihr Erbe damit verfahren soll",
	"_enterself": "Persönliche Angaben Eingeben",
	"_entersuccessor": "Rechtsnachfolger Eingeben",
	"_enterasset": "Netzwerkaccounts Eingeben",
	"_has_self": "Sie haben bereits persönliche Angaben gemacht",
	"_has_no_self": "Sie haben noch keine persönliche Angaben gemacht",
	"_has_successor": "Sie haben bereits einen oder mehrere Rechtsnachfolger eingegeben",
	"_has_no_successor": "Sie haben noch keinen Rechtsnachfolger eingegeben",
	"_has_asset": "Sie haben bereits einen oder mehrere Netzwerkaccounts eingegeben",
	"_has_no_asset": "Sie haben noch keine Netzwerkaccounts eingegeben",
	"_data": "Daten Verwalten",
	"_export": "Daten Exportieren",
	"_import": "Daten Importieren",
	"_importdone": "Daten wurden importiert",
	"_exporthelp": "Kopieren Sie den Inhalt der Box in eine Textdatei und "
	    +"speichern Sie sie ab. Sie können damit Ihre Eingaben später "
	    +"wieder herstellen:",
	"_dataindex": "Hier können Sie Ihre Daten verwalten, für die Zukunft sichern und wiederherstellen.",
	"_importhelp": "Fügen Sie hier den Inhalt eines vorherigen Exports hinein um Ihre Daten wiederherzustellen",
	"_successorsindex": "Dies ist die Liste Ihrer Rechtsnachfolger. Sie können eine oder "
	    +"mehrere Personen bestimmen, die sich nach Ihrem Tode um Ihre Netzwerkaccounts kümmern "
	    +"sollen. Sie können diesen Teil aber auch weglassen. In dem Fall werden Ihre legalen "
	    +"Erben, bestimmt durch Testament oder gesetzliche Erbfolge, für Ihre Accounts zuständig.",
	"_assetsindex": "Dies ist die Liste Ihrer Netzwerkaccounts. Dabei handelt es sich um "
	    +"Zugänge zu Webseiten, Foren, sozialen Netzwerken, Email oder auch Webhosting. Geben Sie "
	    +"so viele Details wie möglich an, umso besser wird sich Ihr Rechtsnachfolger nach Ihrem "
	    +"Ableben darum kümmern können.",
	"_error_address": "Addresse erforderlich",
	"_error_birth": "Geburtsdatum erforderlich",
	"_error_name": "Name erforderlich",
	"_error_password": "Passwort erforderlich",
	"_importpass": "Import Passwort",
	"_error_decrypt": "Entschlüsseln der importierten Daten fehlgeschlagen",
	"_error_order": "Wählen Sie einen Auftrag",
	"_error_successor": "Wählen Sie einen Rechtsnachfolger",
	"_importagain": "Import Wiederholen",
	"_download": "Daten auf die Festplatte Speichern",
	"_up_file": "Oder, verwenden Sie eine vorher exportierte Datei",
	"_up_select": "Importdatei Auswählen",
	"_up_change": "Ändern",
	"_up_remove": "Entfernen",
	"_nopasswd": "Es wurde bisher noch kein Passwort eingestellt. Gehen Sie zu 'Eigene Angaben', "
	    +"stellen Sie dort ein Passwort ein und versuchen Sie es dann erneut",
	"_testamentempty": "Sie haben noch keine Netzwerkaccounts und keine Rechtsnachfolger eingeben, "
	+"daher können Sie noch kein Testament ausdrucken. Beginnen Sie mit der Dateneingabe hier: "
    }
};

// locale helper for use in app.js, not for templates
function translate(key) {
    var locale = window.locale[lang] || window.locale['en-US'];
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
}

// https://gist.github.com/tracend/3261055
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

Ember.Handlebars.registerBoundHelper('ifeq', function(v1, v2, options) {
    return (this.get(v1) == v2) ? options.fn(this) : '';
});

Ember.Handlebars.registerBoundHelper('date', function(date) {
    moment().lang(lang);
    return moment(date).format('LL');
});

Ember.Handlebars.registerBoundHelper('encrypt', function(cleartext) {
    pass = App.Self.find(0).get('password');
    if(pass) {
	var enpass = CryptoJS.SHA512(pass).toString(CryptoJS.enc.Base64);
	//console.log("pass: %s, enpass: %s", pass, enpass);
	var cr = CryptoJS.AES.encrypt(escape(cleartext), enpass);
	return cr;
	
    }
    else {
	return "Failed to encrypt, not password set";
    }
});
