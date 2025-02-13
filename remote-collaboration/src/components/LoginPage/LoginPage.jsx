import React, {
    useState
} from "react";
import "./LoginPage.css"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Background from "../../assets/background-clouds.avif";

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

  useEffect(() => {
    // Apply background image only for the login page
    document.body.style.backgroundImage = `
    linear-gradient( 180deg,
    rgba(255, 255, 255, 0),    
    rgba(255, 255, 255, .1)),
    url(${Background})
  `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";

    return () => {
      // Remove background when leaving the login page
      document.body.style.backgroundImage = "";
    };
  }, []);

        return (
            <>
                <div className="login-container">
                    <h1 id="login-app-name">[App Name]</h1>
                    <div className="login-input-boxes">
                        <input type="email" className="login-email" placeholder="Username or Email" value={email} onChange={changeEmail}/>
                        <input type="password" className="login-password" placeholder="Password" value={password} onChange={changePassword}/>
                    </div>
                    <div className="login-buttons">
                        <button id="login-login-button" onClick={handleLogin}>Login</button>
                        <button id="login-signup-button" onClick={switchToSignUp}>Sign Up</button>
                    </div>
                </div>
                
            </>
        )
}



export default LoginPage