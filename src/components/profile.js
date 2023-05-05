import React, { useState, useEffect } from 'react';
import { GET_USER } from '../graphql/queries';

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

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: []
        };
    };
    
    async componentDidMount() {
        const token = localStorage.getItem('token')
        const id = parseJwt(token).sub

        const result = await customFetch(token,GET_USER(id) );

        let data = {
            id: id,
            result: result.json()
        }
        
        console.log("Result: ",result.json().data())
        this.setState({ data });
    }

  render() {
    return (
        <div>
            <label>Your id {this.state.data.id}</label>
            
        </div>
    );
  }

}

export default ProfilePage;