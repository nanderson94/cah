if (Meteor.isClient) {
  // counter starts at 0
  Template.Home.events({
    '#play click': function() {
      Router.go('/new');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.configure({
  layoutTemplate: "ApplicationLayout"
});

Router.route("/", function() {
  this.render("Home");
});

Router.route("/new", function() {
  this.render("New");
});
