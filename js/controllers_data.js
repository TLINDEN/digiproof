

App.DataExportController = Ember.ArrayController.extend({
    successors: App.Successor.find(),
    self:       App.Self.find(0),
    assets:     App.Asset.find(),
    download: function() {
	/*
	  Encrypt the data:

	  1) the data/export template receives all objects and puts
	     json objects of it into the invisible div 'rawjson'.
	     this happened on first template execution.

	  2) when the 'download' action gets triggered, fetch that
	     generated json out of the div.

	  3) fetch self.pass and create an SHA512 hash from it.

	  4) hash this hash 32times recursive (that is, create a
	     hash of the previous hash and so on 32 times).

	  5) encrypt the json string using AES256 using the generated
	     base64 encoded hash.

	  6) put the base64 encoded encrypted data into the div 'rawdata'

	  7) retrieve the data from 'rawdata'. note: it doesn't work
	     to just continue to work with the already base64 encoded
	     data (variable cr), it is empty. however, if we put it into
	     the div and retrieve it right away then it's filled.
	     that's reliable javascript programming, yay.

	  8) now calculate a SHA256 MAC authentication message of the
	     base64 encoded encrypted data using the base64 encoded
	     password hash (=> mac).

	  9) concatenate the mac and the encrypted data (mac first minus
	     the last 2 chars '==') (=> signedcrypted).

	 10) insert a msdos newline every 64 chars so that we get a nice
	     base64 encoded block.

	 11) add a header and footer to that block.

	 12) create a Blob object of that block.

	 13) put up a "save as..." dialog box to the user using this
	     blob as content.

	 */
	var raw = $('#rawjson').text();
	var pass = $('#rawp').text();
	var hash = CryptoJS.SHA512(pass);

	for(var i=0; i<31; i++) {
	    hash = CryptoJS.SHA512(hash);
	}

	var cr  = CryptoJS.AES.encrypt(escape(raw), hash.toString(CryptoJS.enc.Base64));

	$('#rawdata').text(cr);

	var crypted = $('#rawdata').text();

	var mac = CryptoJS.HmacSHA512(crypted, hash.toString(CryptoJS.enc.Base64));
	var signedcrypted = mac.toString(CryptoJS.enc.Base64).substring(0,86) + crypted;

	console.log("raw: %s", raw);
	console.log("cr: %s", crypted);
	console.log("pass: <%s>, hash: <%s>", pass, hash.toString(CryptoJS.enc.Base64));
	console.log("mac: %s",  mac.toString(CryptoJS.enc.Base64).substring(0,86));

	var block = '';
	var c = 1;
	for(var i=0; i<signedcrypted.length; i++) {
	    block += signedcrypted[i];
	    if(c == 64) {
		block += "\r\n";
		c = 0;
	    }
	    c++;
	}


	block = "---- BEGIN ENCRYPTED DIGIPROOF DATA ----\r\n"
	    + block +  "\r\n---- END ENCRYPTED DIGIPROOF DATA ----\r\n";
	var blob = new Blob([block], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "digiproof-export.txt");
    }
});




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
	// decrypt and reload models
	var validated =  this.get('model').validate();
	if(validated.valid) {
	    this.set('isEditing', false);
	    pass = this.get('password');

	    try {
		var raw = '';
		if(UploadedImport) {
		    //console.log("using upload");
		    raw = UploadedImport;
		    UploadedImport = null;
		}
		else if (this.get('importdata')) {
		    //console.log("using input");
		    raw = this.get('importdata');
		}
		else {
		    throw 'No import data provided';
		}

		// check for header and footer
		var begin = raw.search(/BEGIN ENCRYPTED DIGIPROOF DATA/);
		var end   = raw.search(/END ENCRYPTED DIGIPROOF DATA/);
		if(begin == -1 || end == -1) {
		    throw 'Invalid formatted import data';
		}

		// remove them
		var rawlines = raw.split(/\r\n/);
		var b64lines = rawlines.slice(1).slice(0, rawlines.length - 3);

		// put together as full b64 string
		var b64 = b64lines.join('');

		// extract the auth message
		var b64mac = b64.substring(0,86) + '==';
		var b64cr  = b64.substring(86);

		console.log("b64mac: %s", b64mac);

		// create the password hash
		var hash = CryptoJS.SHA512(pass);
		for(var i=0; i<31; i++) {
		    hash = CryptoJS.SHA512(hash);
		}

		// verify the mac
		var mac = CryptoJS.HmacSHA512(b64cr, hash.toString(CryptoJS.enc.Base64));
		console.log("mac: %s", mac.toString(CryptoJS.enc.Base64));
		if(mac.toString(CryptoJS.enc.Base64) !== b64mac) {
		    throw 'Authentication MAC verification failed, rejecting manipulated encrypted data';
		}

		// now if we're her, decrypt the data
		var json = decryptimport(hash.toString(CryptoJS.enc.Base64), b64cr);
		console.log("pass: <%s>, hash: <%s>, hash: %o", pass, hash.toString(CryptoJS.enc.Base64), hash);
		console.log("json: %s", json);

		// make it an obj
		var importobj = JSON.parse(json); // FIXME: SyntaxError: Unexpected token ], liegt am Komma nach dem letzten item
		console.log("imported json: %o", importobj);
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

    doneEditingXXX: function() {
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
