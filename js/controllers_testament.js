
App.TestamentController = Ember.ArrayController.extend({
    needs: "self",
    //self: Ember.computed.alias("controllers.self"),
    successors: App.Successor.find(),
    self: App.Self.find(0),
    now: new Date(),
    notempty: CheckForEmptyDB()
});

