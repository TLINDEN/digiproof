
App.IndexController = Ember.Controller.extend({
    has_self:      App.Self.find(),
    has_asset:     App.Asset.find(),
    has_successor: App.Successor.find(),
    VERSION: VERSION
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

