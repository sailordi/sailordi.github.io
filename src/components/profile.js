import React, { Component } from 'react';
import { GET_DATA } from '../graphql/queries';
import {customFetch,parseJwt} from '../utility/utility'
import { PieChart } from "react-minimal-pie-chart";
import { getRandomColor } from '../utility/color';
import '../profile.css';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: {}
        };
    };

    handleLogout = () => {
        localStorage.removeItem('token');
        const { navigate } = this.props;
        navigate("/");
    }
    
    async piechart(rawData) {
        if(typeof rawData === 'undefined' || !Array.isArray(rawData)) {
            return [
                { title: "Fuck", value: 25, color: "#E38627" },
                { title: "Cats", value: 35, color: "#C13C37" },
                { title: "Birds", value: 20, color: "#6A2135" },
                { title: "Fish", value: 10, color: "#FF7F50" },
                { title: "Other", value: 10, color: "#00FFFF" },
            ]
        }



        let total = rawData.reduce((a, c) => {
            return a + c.amount
        },0)

        let data = []
    
        for(let i = 0; i < rawData.length; i++) {
            let d = rawData[i]
            let p = (d.amount/total)*100
            let l = d.name
            let c = getRandomColor()

            console.log(l,p)

            data.push({title:l,value: p, color: c})
        }
        return data
    }

    async componentDidMount() {
        const token = localStorage.getItem('token')
        const id = parseJwt(token).sub

        const response = await customFetch(token,GET_DATA(id) );

        let result = await response.json()

        let u = result.data.user[0]
        let transactions = result.data.transaction
        let skills = transactions.filter(t => t.type.includes("skill") === true)
        let xpTransactions = transactions.filter(t => t.type === "xp" && 
                                t.path.includes("school-curriculum") == true && 
                                t.path.includes("piscine-js/") == false &&
                                t.attrs.hasOwnProperty("auditId") == false) 

        let xp = xpTransactions.reduce((a, c) => {
            return a + c.amount
        },0)

        let skillA = []

        for(let i = 0; i < skills.length; i++) {
            let s = skills[i]
            let t = s.type.replace("skill_","")

            if(skillA.filter(s => s.name == t).length <= 0) {
                skillA.push({name:t,amount:s.amount})
            }
            else {
                let o = skillA.find(s => s.name === t)
                o.amount += s.amount
            }
        } 

        let skillStr = ""

        for(let i = 0; i < skillA.length; i++) {
            let t = skillA[i]
            if(i+1 >= skillA.length) {
                skillStr += t.name
            } else {
                skillStr += t.name+", "
            }
        }
        
        let skillChartData = await this.piechart(skillA)

        let user = {
            login: u.login,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            auditRatio: u.auditRatio.toFixed(1),
            xp: (xp/1000).toFixed(0),
            skills: skillChartData,
            skillsStr: skillStr
        }

        this.setState({ user });
    }

  render() {
    let u = this.state.user
    return (
        <div>
            <div id="topBar">
                <label id="welcomeL">Welcome to Your Graphql data {u.login}</label>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
            <div id="infoDiv">
                <div id="baseInfo" class="info">
                    <label id="firstNameL" className="baseL">First name: {u.firstName}</label>
                    <label id="lastNameL" className="baseL">Last name: {u.lastName}</label>
                    <label id="emailL" className="baseL">Email: {u.email}</label>
                </div>
                <div id="xpInfo" class="info">
                    <label id="auditRatioL" className="baseL">Audit ratio: {u.auditRatio}</label>
                    <label id="xpL" className="baseL">Xp: {u.xp} kB</label>
                </div>
                <div id="skillInfo" class="info">
                    <label id="skillsL" className="baseL">Skills: {u.skillsStr}</label>  
                </div>
            </div>

            <div id="skillChart">
                <h3 id="skillChartL">Skills chart</h3>
                <PieChart
                    className='chart'
                    data={u.skills}
                    lineWidth={20}
                    paddingAngle={3}
                    radius={40}
                    viewBoxSize={[300, 300]}
                    center={[57, 60]}
                    label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value.toFixed(2)}%`}
                    labelPosition={105}
                    labelStyle={{ fontSize: '0.2em' }}
                />
            </div>
            
        </div>
    );
  }

}

export default ProfilePage;