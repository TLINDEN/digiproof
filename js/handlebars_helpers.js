
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

