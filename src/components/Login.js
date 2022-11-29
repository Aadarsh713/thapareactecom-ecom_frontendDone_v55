import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
const Login = (props) => {

    const [credentails, setcredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const handlesubmit = async (e) => {
        e.preventDefault();
        //api
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ email: credentails.email, password: credentails.password })
        })
        const json = await response.json();
        console.log(json)
        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token' , json.authtoken);
            props.showAlert("Logged in successfully" , "success")
            navigate("/")
        } else {
            props.showAlert("Invalid details" , "danger")
        }

    }

    const onchange = (e) => {
        setcredentials({ ...credentails, [e.target.name]: e.target.value });
    }

    return (
        <div className='container mx-2 my-3'>
            <h3>Enter Your Details To Login</h3>
            <hr></hr>
            <form onSubmit={handlesubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onchange} value={credentails.email} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onchange} value={credentails.password} name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login
