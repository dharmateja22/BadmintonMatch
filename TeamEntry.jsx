TeamEntry = React.createClass({
    setNewTeam(){
        if(ReactDOM.findDOMNode(this.refs.teamName).value === "" ||
            ReactDOM.findDOMNode(this.refs.player1Name).value === "" ||
            ReactDOM.findDOMNode(this.refs.player2Name).value === "") return;
        //enter data to database
        Meteor.call("insertNewTeam",
            ReactDOM.findDOMNode(this.refs.teamName).value,
            ReactDOM.findDOMNode(this.refs.player1Name).value,
            ReactDOM.findDOMNode(this.refs.player2Name).value);
        //clear input forms
        ReactDOM.findDOMNode(this.refs.teamName).value = "";
        ReactDOM.findDOMNode(this.refs.player1Name).value = "";
        ReactDOM.findDOMNode(this.refs.player2Name).value = "";
    },
    render(){
        return (
            <table className="playerTable">
                <tbody>
                <tr>
                    <td>name</td>
                    <td><input className="playerTableForm" ref="teamName" type="text" placeholder="name"/></td>
                </tr>
                <tr>
                    <td>player 1</td>
                    <td><input className="playerTableForm" ref="player1Name" type="text" placeholder="player name"/></td>
                </tr>
                <tr>
                    <td>player 2</td>
                    <td><input className="playerTableForm" ref="player2Name" type="text" placeholder="player name"/></td>
                </tr>
                <tr>
                    <td></td>
                    <td><button className="playerTableFormSubmit" onClick={this.setNewTeam}>Submit</button></td>
                </tr>
                </tbody>
            </table>
        );
    }
});