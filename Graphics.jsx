var matchDimension = {h:300,w:500};
var teamDimension = {h:120,w:120};
var yOffset = 30;
var xOffset = 30;

Graphics = React.createClass({
    PropTypes:{
        teams:React.PropTypes.array.isRequired,
        matches:React.PropTypes.array.isRequired
    },
    getDefaultProps() {
        return {
            teams:[],
            matches:[],
            width: 500,
            height: 1500
        }
    },

    getInitialState(){
        return {
            currentMatchIndex:-1
        };
    },

    componentDidMount(){
        var svg = d3.select(ReactDOM.findDOMNode(this.refs.chartArea)).append("svg")
            .attr("class","svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);
        this.loadChart();
    },
    findMatch(mchs,id){
        return mchs.find((match)=>{if(match._id === id) return match;});
    },
    componentDidUpdate(prevProps, prevState){
        if(prevProps.matches.length < this.props.matches.length) {
            this.props.matches.map((match,i)=>{
                if((i > prevProps.matches.length-1)) {
                    this.drawMatch(match);
                }
            });
        }
        else {
            this.props.matches.map((match,i)=>{
                var prevMatch = this.findMatch(prevProps.matches,match._id);
                if(prevMatch) {
                    //Update match points
                    if(prevMatch.team1.points != match.team1.points) this.updateTeam1Points(match);
                    if(prevMatch.team2.points != match.team2.points) this.updateTeam2Points(match);
                }
            });
        }
    },

    //update team 1 match points
    updateTeam1Points(match){
        var matchGroup = d3.select(ReactDOM.findDOMNode(this.refs.chartArea)).select("svg").select(".mainGroup")
            .select("."+match._id);
        var scoreGroup = matchGroup.select(".t1ScoreGroup");
        scoreGroup.select(".team1Score").text(match.team1.points);
        scoreGroup.attr("transform","translate("+Number(teamDimension.w)+","+0+")"+" rotate(90)");
        scoreGroup.transition()
        .duration(500)
        .attr("transform","translate("+Number(teamDimension.w)+","+0+")"+" rotate(360)");

        this.setWinner(match,matchGroup);
    },
    setWinner(match,matchGroup){
        //If winner then put a winner sign
        if(match.team1.points === 15) {
            matchGroup.select(".winnerLogo")
                .attr("x", 30)
                .attr("y",40)
                .transition()
                .duration(1000)
                .attr("opacity", 1);
        } else
        if(match.team2.points === 15) {
            matchGroup.select(".winnerLogo")
                .attr("x", Number(matchDimension.w - 30))
                .attr("y",40)
                .transition()
                .duration(1000)
                .attr("opacity", 1);
        }
        else {
            matchGroup.select(".winnerLogo")
                .attr("opacity", 0);
        }
    },
    //update team 2 match points
    updateTeam2Points(match){
        var matchGroup = d3.select(ReactDOM.findDOMNode(this.refs.chartArea)).select("svg").select(".mainGroup")
            .select("."+match._id);
        var scoreGroup = matchGroup.select(".t2ScoreGroup");
        scoreGroup.select(".team2Score").text(match.team2.points);
        scoreGroup.attr("transform","rotate(270)");
        scoreGroup.transition()
            .duration(500)
            .attr("transform","rotate(360)");

        this.setWinner(match,matchGroup);
    },

    render(){
        return <div ref="chartArea"></div>
    },

    //D3 magic happens here!
    loadChart(){
        var drag = d3.behavior.drag()
            .on("dragstart", function() {
                d3.event.sourceEvent.stopPropagation(); // silence other listeners
            })
            .on("drag", () => {
                var mgp = d3.select(".mainGroup");
                var y = d3.transform(mgp.attr("transform")).translate[1]+d3.event.dy;
                mgp.attr("transform", "translate(" +
                    0 + "," +
                    y + ")");
            });


        var svgContainer = d3.select("svg");
        var width = svgContainer.attr("width");
        //Remove everything from svg element
        svgContainer.selectAll('*').remove();

        var mainGroup = svgContainer.append("g")
            .attr("class","mainGroup");
            mainGroup.call(drag);
        mainGroup.append("rect")
            .attr("x",-10)
            .attr("width",width)
            .attr("height",10)
            .attr("fill",'white')
            .attr("class","mainGroupRect");

        this.props.matches.forEach((match,i) => {
            this.drawMatch(match);
        });
    },

    getTeam(id){
        return this.props.teams.find((team) => {if(team._id === id )return team;});
    },

    drawMatch(match){
        var mainGroup = d3.select("svg").select(".mainGroup");
        var rect = mainGroup.select(".mainGroupRect");
        var curRectHeight = rect.attr("height");
        rect.attr("height",Number(curRectHeight)+Number(matchDimension.h+10));

        var matchGroup = mainGroup.append("g").attr("class",match._id);
        matchGroup.attr("transform","translate(0,"+Number(curRectHeight)+")");

        //main rectangle
        matchGroup.append("rect")
            .attr("class","mainRect")
            .attr("width", matchDimension.w)
            .attr("height", matchDimension.h)
            .style("stroke", "green")
            .style("fill", "#727AD4")
            .style("stroke-width",1);
        //Winner word
        matchGroup.append("text")
            .attr("class", "winnerLogo")
            .attr("text-anchor", "middle")
            .attr("font-size", 40)
            .attr("fill", "pink")
            .attr("x", (match.team1.points === 15 || match.team2.points === 15)?
                (match.team1.points === 15?30:matchDimension.w-30) : 0)
            .attr("y", (match.team1.points === 15 || match.team2.points === 15)? 40: 0)
            .attr("opacity", (match.team1.points === 15 || match.team2.points === 15)? 1: 0)
            .text("W");

        //center line
        matchGroup.append("line")
            .attr("class", "centerLine")
            .attr("stroke-width", 4)
            .attr("stroke", "white")
            .attr("x1", matchDimension.w / 2)
            .attr("y1", 0)
            .attr("x2", matchDimension.w / 2)
            .attr("y2", matchDimension.h);

        //team 1 group
        var t1Group = matchGroup.append("g").attr("class","team1Group");
        t1Group.attr("transform","translate("+Number(matchDimension.w / 4 - teamDimension.w / 2+xOffset)+","+Number(matchDimension.h / 2 - teamDimension.h / 2 -yOffset)+")");
        t1Group.append("rect")
            .attr("class", "team1Rect")
            .attr("width", teamDimension.w)
            .attr("height", teamDimension.h)
            .attr("fill", "none");
        t1Group.append("text")
            .attr("class", "team1Name")
            .attr("x",teamDimension.w/2)
            .attr("y",teamDimension.h/2)
            .attr("text-anchor","middle")
            .attr("font-size", 23)
            .attr("font-family","Courier New")
            .attr("fill", "white")
            .text(this.getTeam(match.team1.id).name);

        //score arc team1
        var t1ScoreGroup = t1Group.append("g").attr("class","t1ScoreGroup");
        t1ScoreGroup.attr("transform","translate("+Number(teamDimension.w)+","+0+")");
        var arc = d3.svg.arc()
            .innerRadius(34)
            .outerRadius(0)
            .startAngle(3*Math.PI/2)
            .endAngle(Math.PI*2);
        t1ScoreGroup.append("path")
            .style("fill", "#9CA4FF")
            .attr("d", arc);
        t1ScoreGroup.append("text")
            .attr("class","team1Score")
            .attr("x",-12)
            .attr("y",-8)
            .attr("text-anchor","middle")
            .attr("font-size", 20)
            .style("fill", "#000A75")
            .text(match.team1.points);
        //Flag poles
        t1ScoreGroup.append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#000A75")
            .attr("x1",0)
            .attr("y1",-34)
            .attr("x2",0)
            .attr("y2",0);
        t1ScoreGroup.append("line")
            .attr("stroke-width", 4)
            .attr("stroke", "#000A75")
            .attr("x1",-1)
            .attr("y1",0)
            .attr("x2",-1)
            .attr("y2",40);


        //team 2 group
        var t2Group = matchGroup.append("g").attr("class","team2Group");
        t2Group.attr("transform","translate("+Number(3 * matchDimension.w / 4 - teamDimension.w / 2 - xOffset)+","+Number(matchDimension.h / 2 - teamDimension.h / 2 -yOffset)+")");
        t2Group.append("rect")
            .attr("class", "team2Rect")
            .attr("width", teamDimension.w)
            .attr("height", teamDimension.h)
            .style("fill", "none");
        t2Group.append("text")
            .attr("class", "team2Name")
            .attr("x",teamDimension.w/2)
            .attr("y",teamDimension.h/2)
            .attr("text-anchor","middle")
            .attr("font-size", 23)
            .attr("font-family","Courier New")
            .style("fill", "white")
            .text(this.getTeam(match.team2.id).name);

        //score arc team2
        var t2ScoreGroup = t2Group.append("g").attr("class","t2ScoreGroup");
        var arc1 = d3.svg.arc()
            .innerRadius(34)
            .outerRadius(0)
            .startAngle(2*Math.PI)
            .endAngle(Math.PI*2+Math.PI/2);
        t2ScoreGroup.append("path")
            .style("fill", "#9CA4FF")
            .attr("d", arc1);
        t2ScoreGroup.append("text")
            .attr("class","team2Score")
            .attr("x",12)
            .attr("y",-8)
            .attr("text-anchor","middle")
            .attr("font-size", 20)
            .style("fill", "#000A75")
            .text(match.team2.points);
        t2ScoreGroup.append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "#000A75")
            .attr("x1",0)
            .attr("y1",-34)
            .attr("x2",0)
            .attr("y2",0);
        t2ScoreGroup.append("line")
            .attr("stroke-width", 4)
            .attr("stroke", "#000A75")
            .attr("x1",1)
            .attr("y1",0)
            .attr("x2",1)
            .attr("y2",40);
    }
});














