import React, {
    useState
} from "react";
import "./LoginPage.css"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    
    const changeEmail = (event) => {
        setEmail(event.target.value);
    }

    const changePassword = (event) =>{
        setPassword(event.target.value)
    }

    const handleLogin = () => {
        console.log(email)
        console.log(password)
        if (email != "" && password != "") {
            navigate('/HomePage'); 
        }
        else(
            toast.error("Invalid username or password")
        )
    }

    const switchToSignUp = () => {
        navigate('/SignUpPage'); 
    }
        return (
            <>
                <div className="login-container">
                    <h1 id="app-name">[App Name]</h1>
                    <div className="input-boxes">
                        <input type="email" className="login-email" placeholder="Username or Email" value={email} onChange={changeEmail}/>
                        <input type="password" className="login-password" placeholder="Password" value={password} onChange={changePassword}/>
                    </div>
                    <div className="buttons">
                        <button id="login-button" onClick={handleLogin}>Login</button>
                        <button id="signup-button" onClick={switchToSignUp}>Sign Up</button>
                    </div>
                </div>
                
            </>
        )
}



export default LoginPage