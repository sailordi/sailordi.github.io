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

        let user = {
            id: id,
            login: u.login,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            auditRatio: u.auditRatio.toFixed(1)
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
                <label id="firstNameL">First name: {this.state.user.firstName}</label>
                <label id="lastNameL">Last name: {this.state.user.lastName}</label>
                <label id="emailL">Email: {this.state.user.email}</label>
                <label id="idL">Id {this.state.user.id}</label>
            </div>
            
        </div>
    );
  }

}

export default ProfilePage;