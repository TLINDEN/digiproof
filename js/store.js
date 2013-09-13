
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
	this.commit();
    }
});
