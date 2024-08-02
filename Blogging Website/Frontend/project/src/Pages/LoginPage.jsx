import axios from "axios";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function LoginPage()
{   const [username,setUsername]= useState('');
    const [password,setPassword]=useState('');
    const [loginStatus, setLoginStatus]= useState('LOG IN');
    const [redirect, setRedirect]=useState(false);
    const {setUserInfo}= useContext(UserContext);
    async function login(event)
    {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password }, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            });
        
            if (response.status === 200) { 
                // Axios uses HTTP status codes for success/failure
                const userInfo=response.data;
                setUserInfo(userInfo);
                setRedirect(true);
              
            } else {
              setLoginStatus('INVALID!');
            }
            
          } catch (error) {
            console.error('Error during login:', error);
            setLoginStatus('INVALID!');
          }
          
    }
    if(redirect)
        {
            return (<Navigate to={'/'}/>);
        }
    return(
        

        <div className="outer_login_container">
        <div className="login_container">
            <h1>{loginStatus}</h1>
            <form className="signin" onSubmit={login}>
                <input type="text" placeholder="Username" onChange={(event)=>{setUsername(event.target.value);}}></input>
                <input type="password" placeholder="Password" onChange={(event)=>{setPassword(event.target.value);}}></input>
                <button type="submit">Login</button>
            </form>
        </div>
        </div>
        
    );
}