import React, { Component } from 'react';
import { GET_DATA } from '../graphql/queries';
import {customFetch,parseJwt,transactionName,normalize} from '../utility/utility'
import { getRandomColor } from '../utility/color';
import SkillChart from "./skillChart"
import TransactionChart from "./transactionChart"
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

    collectSkillChartData(skills) {
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
        return skillA
    }

    skillsToString(skills) {
        let skillStr = ""

        for(let i = 0; i < skills.length; i++) {
            let t = skills[i]

            if(i+1 >= skills.length) {
                skillStr += t.name
            } else {
                skillStr += t.name+", "
            }
        }
        return skillStr
    }

    collectTransactionChartData(transactions) {
        let ret = {
            array:[],
            max:0,
            min:0
        }

        ret.max = transactions.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
        ret.min = transactions.reduce((prev, current) => (prev.amount < current.amount) ? prev : current);

        ret.max = ret.max.amount
        ret.min = ret.min.amount

        transactions.sort( (a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        for(let i = 0; i < transactions.length; i++) {
            let t = transactions[i]
        
            ret.array.push({name:transactionName(t.path),XP:t.amount})
        }

        return ret
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
        let trasactionChartData = this.collectTransactionChartData(xpTransactions)

        let xp = xpTransactions.reduce((a, c) => {return a + c.amount},0)

        let skillA = this.collectSkillChartData(skills)
        let skillStr = this.skillsToString(skillA)

        let user = {
            login: u.login,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            auditRatio: u.auditRatio.toFixed(1),
            xp: (xp/1000).toFixed(0),
            skills: skillA,
            skillsStr: skillStr,
            chartData: trasactionChartData.array,
            chartMax: trasactionChartData.max,
            chartMin: trasactionChartData.min
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
                    <div id="baseInfo" className="info">
                        <label id="firstNameL" className="baseL">First name: {u.firstName}</label>
                        <label id="lastNameL" className="baseL">Last name: {u.lastName}</label>
                        <label id="emailL" className="baseL">Email: {u.email}</label>
                    </div>
                    <div id="xpInfo" className="info">
                        <label id="auditRatioL" className="baseL">Audit ratio: {u.auditRatio}</label>
                        <label id="xpL" className="baseL">Xp: {u.xp} kB</label>
                    </div>
                    <div id="skillInfo" className="info">
                        <label id="skillsL" className="baseL">Skills: {u.skillsStr}</label>  
                    </div>
                </div>
                <div className='charts'>
                    <SkillChart rawData={u.skills}/>
                    <TransactionChart chart={{class: "transactionChart",divClass: "TransactionD",labelClass: "transactionL",labelText:"XP earned by project"}} 
                        width={900} height={500} data={u.chartData} color={getRandomColor()}
                    />
                </div>
            </div>
        );
    }

}

export default ProfilePage;