import axios from 'axios';
import { useState } from 'react';
export default function SignUpPage()
{
    const [username, setUsername]= useState('');
    const [password, setPassword]= useState('');
    const [signUpStatus, setSignUpStatus]= useState('SIGN UP');
    async function register(event)
    {
        event.preventDefault();
        await axios.post('http://localhost:3000/register',{username:username,password:password})
        .then(()=>{setSignUpStatus('Successful!');})
        .catch(error=>{alert("You cannot use this username!");});

    }
    return(
        <div className="outer_login_container">
        <div className="login_container">
            <h1>{signUpStatus}</h1>
            <form className="signin" onSubmit={register}>
                <input type="text" placeholder="Username" onChange={(event)=>{setUsername(event.target.value);}}></input>
                <input type="password" placeholder="Password" onChange={(event)=>{setPassword(event.target.value);}}></input>
                <button type="submit">Sign Up</button>
            </form>
        </div>
        </div>
    );
}