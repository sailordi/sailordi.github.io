import React, { Component } from 'react';
import { GET_DATA } from '../graphql/queries';

import '../profile.css';

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

async function customFetch(token,query) {
    const res = await fetch("https://01.gritlab.ax/api/graphql-engine/v1/graphql",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ query: query }),
    })

    return res
}

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: []
        };
    };

    handleLogout = () => {
        localStorage.removeItem('token');
        const { navigate } = this.props;
        navigate("/");
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
        
        let user = {
            login: u.login,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            auditRatio: u.auditRatio.toFixed(1),
            xp: (xp/1000).toFixed(0),
            skills: skillStr
        }

        this.setState({ user });
    }

  render() {
    return (
        <div>
            <div id="topBar">
                <label id="welcomeL">Welcome to Your Graphql data {this.state.user.login}</label>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
            <div id="baseInfo">
                <label id="firstNameL" className="baseL">First name: {this.state.user.firstName}</label>
                <label id="lastNameL" className="baseL">Last name: {this.state.user.lastName}</label>
                <label id="emailL" className="baseL">Email: {this.state.user.email}</label>
                <label id="auditRatioL" className="baseL">Audit ratio: {this.state.user.auditRatio}</label>
                <label id="xpL" className="baseL">Xp: {this.state.user.xp} kB</label>
                <label id="skillsL" className="baseL">Skills: {this.state.user.skills}</label>
            </div>
            <div id="skillChart">
            </div>
            
        </div>
    );
  }

}

export default ProfilePage;