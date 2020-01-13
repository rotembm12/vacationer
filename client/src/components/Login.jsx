import React, {useState} from 'react';
import {MDBBtn, MDBInput} from 'mdbreact';
const Login = ({handleLogin, isLogged}) => {
    const [name, setName] = useState()
    const [pass, setPass] = useState()
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
            <div className="login row justify-content-center p-5">
                <div className="col-7">
                    <MDBInput 
                        type="text" 
                        label="Username"
                        value={name} 
                        onChange={ (e) => setName(e.target.value) }
                    />
                </div>
                <div className="col-7">
                    <MDBInput 
                        type="password" 
                        label="Password"
                        value={pass} 
                        onChange={ (e) => setPass(e.target.value) }
                    />
                </div>
                
                <div className="col-6 text-center">
                    <MDBBtn
                        onClick={onLogin}
                        color="light-blue"
                        size="lg"
                    >
                        Login
                    </MDBBtn>
                </div>
            </div>
        )} 
        </div>    
    )

}
export default Login;