GamePlay = React.createClass({
    PropTypes : {
        teams:React.PropTypes.array.isRequired
    },
    getInitialState(){
        return {
            team1:{},
            team2:{},
            team1Points:0,
            team2Points:0,
            matchSet: false,
            matchId:""
        };
    },
    findTeam(id){
        return this.props.teams.find((team) => {
            if(team._id === id) return team;
        })
    },
    selectTeam1(e){
        this.setState({team1:this.findTeam(e.target.value)});
    },
    selectTeam2(e){
        this.setState({team2:this.findTeam(e.target.value)});
    },
    render(){
        return(
            <table className="matchSelect">
                <tbody>
                    <tr className="matchTeamHead">
                        <td>Team 1</td>
                        <td></td>
                        <td>Team 2</td>
                    </tr>
                    <tr>
                        <td>
                            <select
                                className="matchTeamSelect"
                                value={this.state.team1.length < 1 ? "-0" : this.state.team1._id}
                                onChange={this.selectTeam1}
                                ref="team1Select"
                                disabled={this.state.matchSet}>
                                <option key="-0" value="-0" > -- select a team -- </option>
                                {this.props.teams.map((team) => {
                                    return <option key={team._id} value={team._id}>{team.name}</option>
                                })}
                            </select>
                        </td>
                        <td><p>Vs</p></td>
                        <td>
                            <select
                                className="matchTeamSelect"
                                value={this.state.team2.length < 1 ? "-0" : this.state.team2._id}
                                onChange={this.selectTeam2}
                                ref="team2Select"
                                disabled={this.state.matchSet}>
                                <option key="-0" value="-0" > -- select a team -- </option>
                                {this.props.teams.map((team) => {
                                    return <option key={team._id} value={team._id}>{team.name}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                    {this.state.matchSet ? this.getStartButtons() : this.getSetButton()}
                    {this.state.matchSet ? this.getFinishButton() : <tr></tr>}
                </tbody>
            </table>
        );
    },

    setMatch(){
        //Check if either of the team selection ref have -0 value
        var teamId1 = ReactDOM.findDOMNode(this.refs.team1Select).value,
            teamId2 = ReactDOM.findDOMNode(this.refs.team2Select).value;
        if(teamId1 === "-0" ||
            teamId2 === "-0")
        return;
        //this.setState({matchSet:true});
        //Enter into database
        Meteor.call("insertNewMatch",teamId1,teamId2,(error, result) => {
            this.setState({matchSet:true,matchId:result});
        });
    },

    getSetButton(){
        return (
            <tr>
                <td></td>
                <td><button className="matchSelectSet" onClick={this.setMatch}>Set</button></td>
                <td></td>
            </tr>
        );
    },

    incrementTeam1Point(){
        if(this.state.team1Points === 15) return;
        this.setState((prevState, props) => {
            return {"team1Points":++prevState.team1Points};
        });
        Meteor.call("addTeam1MatchPoints",this.state.matchId,this.state.team1Points+1);
    },
    decrementTeam1Point(){
        if(this.state.team1Points === 0) return;
        this.setState((prevState, props) => {
            return {"team1Points":--prevState.team1Points};
        });
        Meteor.call("addTeam1MatchPoints",this.state.matchId,this.state.team1Points-1);
    },

    incrementTeam2Point(){
        if(this.state.team2Points === 15) return;
        this.setState((prevState, props) => {
            return {"team2Points":++prevState.team2Points};
        });
        Meteor.call("addTeam2MatchPoints",this.state.matchId,this.state.team2Points+1);
    },
    decrementTeam2Point(){
        if(this.state.team2Points === 0) return;
        this.setState((prevState, props) => {
            return {"team2Points":--prevState.team2Points};
        });
        Meteor.call("addTeam2MatchPoints",this.state.matchId,this.state.team2Points-1);
    },
    getStartButtons(){
        return(
            <tr>
                <td>
                    <button className="matchSelectPoints" onClick={this.incrementTeam1Point}>+</button>
                    <p className="matchSelectTeamPoints">{this.state.team1 === null ? "" : this.state.team1Points}</p>
                    <button className="matchSelectPoints" onClick={this.decrementTeam1Point}>-</button>
                </td>
                <td className="matchSelectMatchPoints">
                    Game<br/>points
                </td>
                <td>
                    <button className="matchSelectPoints" onClick={this.incrementTeam2Point}>+</button>
                    <p className="matchSelectTeamPoints">{this.state.team2 === null ? "" : this.state.team2Points}</p>
                    <button className="matchSelectPoints" onClick={this.decrementTeam2Point}>-</button>
                </td>
            </tr>
        );
    },

    finishMatch(){
        //manually reset the selection drop down
        ReactDOM.findDOMNode(this.refs.team1Select).value = "-0";
        ReactDOM.findDOMNode(this.refs.team2Select).value = "-0";
        this.setState({team1Points:0,team2Points:0,team1:{},team2:{},matchSet:false,matchId:""});
    },
    getFinishButton(){
        return (
            <tr>
                <td></td>
                <td><button className="matchSelectFinish" onClick={this.finishMatch}>Finish<br/>Match</button></td>
                <td></td>
            </tr>
        );
    }
});