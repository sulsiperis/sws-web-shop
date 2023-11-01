import React from "react"
import dbQuery from "../functions/dbQuery"
import { 
    collection,
    onSnapshot, 
    addDoc, //adds collection to db
    doc, //reference to specific item
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
  } from "firebase/firestore"
import { db } from "../firebase"
import bcrypt from "bcryptjs-react"; //passw encryption

//const bcrypt = require('bcryptjs');
const saltRounds = 12;

export default function LoginSignup(props) {
    const [showSignup, setShowSignup] = React.useState(false)
    const [loginData, setLoginData] = React.useState({
        "email": "",
        "passw": ""
    })
    const [signupData, setSignupData] = React.useState({
        "email": "",
        "name": "",
        "passw": "",
        "passw2": ""
    })
    

    //users hook
    
    


    function toggleSignup() {
        setShowSignup(oldVal => !oldVal)
    }

    function handleLoginSubmit(event) {
        event.preventDefault()
        if((loginData.passw!=="") && (loginData.email!=="")) {
            const getUserData = async() => {
                const userData = await dbQuery("sws-users", db, false, ["email", "==", loginData.email])

                //console.log(userData[0].data().email)

                if(userData[0]?.data().email) {
                    const ppp = async() => {
                        const passwHash = await bcrypt.compare(loginData.passw, userData[0].data().passw)
                        if(passwHash) {                            
                            props.handleLogin(true)

                            //change this into useRef ************************
                            setLoginData({
                                "email": "",
                                "passw": ""
                            })
                            //console.log("successful login!!!!!!!")
                            props.handleCookie(userData[0].data().name, userData[0].id)

                        } else {
                            alert("Wrong email or password")
                        }
                    }
                    ppp()
                } else {
                    alert("User not found!")
                }
            }
            getUserData()

           // console.log(loginData)
        }
    }

    function handleSignupSubmit(event) {
        event.preventDefault()
        if(signupData.passw.length >= 6) {
            if(signupData.passw === signupData.passw2) {
                //double check to prevent errors and possible hacks
                if( (signupData.passw2!=="") && (signupData.passw!=="") && (signupData.name!=="") && (signupData.email!=="")) {
                    const qData = async () => {
                        const querySnap = await dbQuery("sws-users", db, false, ["email", "==", signupData.email])
                        if(querySnap.length > 0) {
                            alert("Email already exists!")
                        } else {
                            const checkPassw = async() => {
                                const passwHash = await bcrypt.hash(signupData.passw, saltRounds)
                                if(passwHash) {
                                    const docRef = async() => await addDoc(collection(db, "sws-users"), {
                                        name: signupData.name,
                                        email: signupData.email,
                                        level: props.users.length>0?9:1,
                                        passw: passwHash,
                                        color_theme: "default",
                                        registration_date: new Date(),
                                        last_seen_date: new Date()
                                    })
                                    docRef()

                                    //console.log("successful signup")
                                    setSignupData({
                                        "email": "",
                                        "name": "",
                                        "passw": "",
                                        "passw2": ""
                                    })
                                    toggleSignup()

                                    //clear signupdata and hide signup block
                                }
                            }
                            checkPassw()
                        }

                    }
                    qData()

                }
                        
            } else {
                alert("Passwords missmatch!")
            }            
        } else {
            alert ("Password must be at least 6 symbols!")
        }
        
    }

    function handleChangeLogin(event) {
        const {name, value} = event.target
        setLoginData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    function handleChangeSignup(event) {
        const {name, value} = event.target 
        setSignupData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    return (
        <div className="login">
            
            <form name="loginForm" className="login" onSubmit={handleLoginSubmit} > 
                <div className="login-wrapper">
                    <input type="email" className="input" name="email" placeholder="Email" required value={loginData.email} onChange={handleChangeLogin} />
                    <input type="password" className="input" name="passw" placeholder="Password" required value={loginData.passw} onChange={handleChangeLogin} />
                    <button type="submit" className="btn">Login</button>
                </div>
            </form>
            
            <h4>- Or -</h4>
            <span className="link" onClick={toggleSignup}>Sign-up</span>
            {showSignup &&
                <form name="signupForm" className="login" onSubmit={handleSignupSubmit} >
                    <div className="signup-wrapper">
                    
                        <input className="input" type="email" name="email" placeholder="Email" required value={signupData.email} onChange={handleChangeSignup} />
                        <input className="input" type="text" name="name" placeholder="Name" required value={signupData.name} onChange={handleChangeSignup} />
                        <input className="input" type="password" name="passw" placeholder="Password" required value={signupData.passw} onChange={handleChangeSignup} />
                        <input className="input" type="password" name="passw2" placeholder="Repeat password" required value={signupData.passw2} onChange={handleChangeSignup} />
                        <button type="submit" className="btn">Sign up</button>
                    </div>
                </form>
                
            }
        </div>
    )
}