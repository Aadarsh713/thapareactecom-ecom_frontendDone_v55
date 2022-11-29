import React , {useState} from 'react'
import {useNavigate} from "react-router-dom"

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: "" , email: "", password: "" , cpassword:"" });
    let navigate = useNavigate();
    const handlesubmit = async (e) => {
        e.preventDefault();
        //api
        const {name,email,password} = credentials
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({name,email,password})
        })
        const json = await response.json();
        console.log(json)
        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem("token" , json.authtoken);
            navigate("/")
            props.showAlert("Account created successfully" , "success")
        } else {
            props.showAlert("Invalid Credentials" , "danger")
        }

    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container mx-2 my-3'>
            <h3>Enter Your Details To SignUp</h3>
            <hr></hr>
            <form onSubmit={handlesubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onchange} value={credentials.name} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onchange} value={credentials.email} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onchange} value={credentials.password} name="password" required minLength={5}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" onChange={onchange} value={credentials.cpassword} name="cpassword" required minLength={5} />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}

export default Signup
