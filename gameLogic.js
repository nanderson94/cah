var Rooms = typeof Rooms == "undefined" ?  new Mongo.Collection("rooms") : Rooms;

Meteor.publish("rooms", function() {
  var user = Meteor.user();
  if (!user || ! "username" in user) {
    this.error(new Meteor.Error("Not Authorized",
      "You must be authenticated to do this!")
    );
    return;
  }
  var username = user.username;
  return Rooms.find(
    {
      $or: [
        {
          meta: {
            privacy: { $in: ["public", "invite"] }
          }
        },
        {'members.name': username}
      ]
    }
  );
});


Meteor.methods({
  createRoom: function(title, wins, maxpl, priv, packs) {
    //check(title, String);
    //check(wins, Match.Where(function(x) { return x > 0 && x < 100 }));
    //check(maxpl, Match.Where(function(x) { return x > 2 && x < 100}));
    //check(priv, Match.Where(function(x) { return ["public","invite","private"].indexOf(x)>=0}));
    
    var RoomID = Random.id(7);
    var InviteCode = Random.secret(24);
    var User = Meteor.user();
    var Username = User.username;

    Rooms.insert({
      meta: {
        name: title,
        id: RoomID,
        invite: InviteCode,
        max: maxpl,
        privacy: priv
      },
      members: [
        {
          name: Username,
          isOwner: true,
          isAdmin: true
        }
      ],
      game: {
        hands:[
          {
            name:Username,
            cards:[]
          }
        ],
        blacksplayed: [],
        whitesdealt: [],
        currentblack: {},
        prevwins: []
      }
    }, function(err, id) {
      if (err) {
        console.log(err)
      }
    });
    return {
      'roomId':RoomID
    };
  },

});

