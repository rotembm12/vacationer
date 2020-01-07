import React, {useState} from 'react';

const Login = ({handleLogin, isLogged}) => {
    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const onLogin = () => {
        if(name === "" || pass === ""){
            return alert('please fill all fields');
        }
        const user = {
            username: name,
            password: pass,
            email: 'rot@gmail.com'
        }
        handleLogin(user);
    }

    return (
        <div>
        { isLogged  ? (
            <div>Welcome Admin</div>
            ) : (
            <div className="login">
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={ (e) => setName(e.target.value) }
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={pass} 
                        onChange={ (e) => setPass(e.target.value) }
                    />
                </div>
                <button onClick={onLogin}>Login</button>
            </div>
        )} 
        </div>    
    )

}
export default Login;