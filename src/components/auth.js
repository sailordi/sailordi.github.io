import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Data} from '../const';
import axios from 'axios';
import '../auth.css';

function LoginPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let link = `https://${Data.Domain}/api/auth/signin`
    
        try {
            let response;
    
            // login with email
            if (userData.includes('@')) {
              response = await axios.post(
                link,
                {email: userData, password: password,},
                {headers: {Authorization: `Basic ${btoa(`${userData}:${password}`)}`,},}
              );
            } else { // login with username
              response = await axios.post(
                link,
                {username: userData, password: password,},
                {headers: {Authorization: `Basic ${btoa(`${userData}:${password}`)}`,},}
              );
            }
            localStorage.setItem('token', response.data);

            navigate('/profile');
        } catch (error) {
            setError(error.response.data.message);
        }
    
    };
  
    return (
        <div>
          {error && <div>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label id="userDataL">Username/Email: </label>
            <input
              id="userData"
              type="text"
              placeholder="Username or Email"
              value={userData}
              onChange={(e) => setUserData(e.target.value)}
            />
            <label id="passL">Password: </label>
            <input
            id="pass"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
    );
}

export default LoginPage;