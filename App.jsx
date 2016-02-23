App = React.createClass({
    //This mixin makes the getMeteorData method work
    mixins:[ReactMeteorData],

    //Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData(){
        return {
            teams:TeamsCollection.find({}).fetch(),
            matches:MatchesCollections.find({},{sort:{createdAt:1}}).fetch()
        }
    },

    render(){
        return (
            <div>
                <h1>D3 generated graphs</h1>
                <TeamEntry/>
                <GamePlay
                    teams={this.data.teams}
                />
                <Graphics
                    teams={this.data.teams}
                    matches={this.data.matches}
                />
            </div>
        );
    }
});