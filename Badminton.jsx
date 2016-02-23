TeamsCollection = new Mongo.Collection("teams");
MatchesCollections = new Mongo.Collection("matches");

if(Meteor.isServer) {
    Meteor.publish("teams",()=>{return TeamsCollection.find({});});
    Meteor.publish("matches",()=>{return MatchesCollections.find({});});
}

if(Meteor.isClient) {
    Meteor.subscribe("teams");
    Meteor.subscribe("matches");
    Meteor.startup(function () {
        ReactDOM.render(<App />, document.getElementById("app-body"));
    });
}

Meteor.methods({
    insertNewTeam(nm,pl1,pl2){
        TeamsCollection.insert({
            name:nm,
            player1:pl1,
            player2:pl2,
            wins:0,
            lost:0,
            draw:0,
            netPoints:0
        });
    },

    insertNewMatch(team1Id,team2Id){
        var matchId = MatchesCollections.insert({
            team1:{id:team1Id,points:0},
            team2:{id:team2Id,points:0},
            createdAt: new Date()
        });
        return matchId;
    },
    addTeam1MatchPoints(matchId, team1Points){
        MatchesCollections.update(matchId, {
            $set: {
                "team1.points":team1Points
            }
        });
        var obj = MatchesCollections.find(matchId).fetch().pop();
        TeamsCollection.update(obj.team1.id,
            {$inc: {netPoints:team1Points}});
    },
    addTeam2MatchPoints(matchId, team2Points){
        MatchesCollections.update(matchId, {
            $set: {
                "team2.points":team2Points
            }
        });
        var obj = MatchesCollections.find(matchId).fetch().pop();
        TeamsCollection.update(obj.team2.id,
            {$inc: {netPoints:team2Points}});
    }

});