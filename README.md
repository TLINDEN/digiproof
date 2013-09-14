DigiProof
=========

Ember.js Digital Testament App.

This is an javascript app which allows you to create and maintain a digital testament.

**This is BETA software, use on your own risk.**

If you want to try it, download the
[standalone file digiproof-prod](https://raw.github.com/TLINDEN/digiproof/master/digiproof-prod.html),
save it to your disk and open it locally in your browser.

There's also a [development version](https://github.com/TLINDEN/digiproof/blob/master/digiproof-dev.html?raw=true),
which retains all data across
browser sessions. This version does store any entered data unencrypted using the
[localStorage adapter for ember.js](https://github.com/rpflorence/ember-localstorage-adapter).
**So, please do not enter any production data into the development version!**

Features
========

- you can enter one or more legal successors
- any number of network assets (i.e. accounts) can be entered
- each account can be assigned to a legal successor
- you can specify what the legal successor shall do with the asset
- the computed result can be printed, usually you sign it and deposit
  at your solicitor.
- the data can be exported in case you want to update it in the future.
  the export is encrypted using AES256. a passphrase has to be entered
  which will be hashed 32 times and used for encryption. A authentication
  MAC (HMAC-SHA512) will be added as well to make sure there have not
  been any tampering with the export.
- localisation support. currently german and english are fully supported.
- full browser support, tested with IE 8, firefox and google chrome.

Screenshots
===========

Here are some screenshots of the app in action. Please note that they might be outdated.

This is the main screen of the app:
![main screen](https://raw.github.com/TLINDEN/digiproof/master/samples/digiproof1.png?raw=true)

Here we entered some asset data (german language version):
![network asset](https://github.com/TLINDEN/digiproof/blob/master/samples/digiproof10.png?raw=true)

[Here is a sample printed testament](https://github.com/TLINDEN/digiproof/blob/master/samples/sample-testament.pdf?raw=true).

More screenshots can be found in the [samples](https://github.com/TLINDEN/digiproof/tree/master/samples)
directory.

Used Javascript Libraries
=========================

- Ember.js
- Handlebars.js
- Twitter Bootstrap (2.x version)
- CryptoJS
- Jquery
- Blob
- json3.js
- localstorage_adapter.js
- moment.js


License
=======

[Licensed under the GPL v2.](https://raw.github.com/TLINDEN/digiproof/master/LICENSE).

Commercial redistribution prohibited.

Author and Copyright
====================

Copyright (c) [T.Linden](http://www.daemon.de/).
