if (Meteor.isClient) {
  // counter starts at 0
  Template.Home.events({
    'click #play': function() {
      Router.go('/new');
    }
  });
  Template.ApplicationLayout.helpers({
    'username': function() {
      var user = Meteor.user();
      return user && 'username' in user ? user.username : 'guest';
    },
    'isGuestUser': function() {
      var user = Meteor.user();
      return !!user ? user.profile.guest : true;
    }
  })
  Template.ApplicationLayout.events({
    'click #logout': function() {
      Meteor.logout();
    },
    'submit #loginForm': function(e) {
      Meteor.loginWithPassword($("#loginUsername").val(), $("#loginPassword").val(), function(err) {
        console.log(err);
        if (err) {
          if (err.error == 403) {
            $("#loginError").text("Your login info didn't work!");
            $("#loginError").show();
          } else {
            $("#loginError").text("An unknown error occured, try again!");
            $("#loginError").show();
          }
          $(" #loginUsername").addClass("error");
        } else {
          $("#loginUsername").val("");
          $("#loginPassword").val("");
          $("#loginError").hide();
          $("#loginForm, #loginUsername, #loginPassword").removeClass("error");
          $("#loginModal").foundation("reveal", "close");
        }
      });
      e.preventDefault();
    },
    'submit #signupForm': function(e) {
      // TODO: Complexity requirements
      e.preventDefault();
      if ($("#signupPassword").val() == $("#signupConfirm")) {
        Meteor.logout();
        Accounts.createUser({
          username:$("#signupUsername").val(),
          password:$("#signupPassword").val(),
          email:$("#signupEmail").val(),
          profile: {

          }
        }, function(err) {
          
        });
      } else {
        $('#signupMatch').show();
        $('#signupPassword, #signupConfirm').addClass('error');
      }
    }
  });
  Template.ApplicationLayout.onRendered(function() {
    $(document).foundation('reflow');
  });
  Template.New.events({
    'submit #newGame': function(e) {
      e.preventDefault();
      var title = $("#roomTitle").val(),
          wins = $("#gamesToWin").val(),
          maxPl = $("#maxPlayers").val(),
          priv = $("#roomPrivacy").val(),
          packs = $("#gamePacks").val();
      // TODO: Error Checking
      Meteor.call("createRoom", title, wins, maxPl, priv, packs, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          Router.go("/play/"+res.roomId);
        }
      });
    }
  });
  Template.Play.events({});
  var Rooms = typeof Rooms == "undefined" ? new Mongo.Collection("rooms") : Rooms;
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

Router.route("/play/:roomid", function() {
  var room = Rooms.findOne({meta:{id:this.params.roomid}});
  var allRooms = Rooms.find({});
  console.log(room);
})
  
