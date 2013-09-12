
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

