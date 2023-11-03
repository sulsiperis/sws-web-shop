import React, {useRef} from "react"
import dbQuery from "../functions/dbQuery"
import { 
    collection,
    addDoc, //adds collection to db
    doc, //reference to specific item
    updateDoc,
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
  } from "firebase/firestore"
import { db } from "../firebase"
import bcrypt from "bcryptjs-react"; //passw encryption
const saltRounds = 12;

export default function UserSettings(props) { 


    const oldpassInputRef = useRef(null)
    const passInputRef = useRef(null)
    const pass2InputRef = useRef(null)
    const newNameInputRef = useRef(null)
    const delUserInputRef = useRef(null)
    const newThemeInputRef = useRef(null)


    async function updatePassw(newPassw) {
        const passwHash = await bcrypt.hash(newPassw, saltRounds)
        if(passwHash) {
            const updateDb = async() => {
                const userRef = doc(db, "sws-users", props.user.id)
                await updateDoc(userRef, { passw: passwHash })
            }
            updateDb()
        }        
    }

    async function checkPassw(passw) {
        

    }
    
    const handleChangePassw = (event) => {
        event.preventDefault()
    
        // Perform registration logic here
        const oldPass = oldpassInputRef.current.value
        const pass = passInputRef.current.value
        const pass2 = pass2InputRef.current.value

        if ((pass.length > 5) && (oldPass.length > 0)) {
            const getUserData = async() => {
                const userData = await dbQuery("sws-users", db, false, ["__name__", "==", props.user.id])
                const checkPass = async() => {
                    const passwHash = await bcrypt.compare(oldPass, userData[0].data().passw)
                    if(passwHash) {
                        if(pass === pass2) {

                            updatePassw(pass)

                            //console.log("success: ", oldPass, pass, pass2)
                            //change passw logic
                            alert("Password changed successfully.")
                            
                            oldpassInputRef.current.value = ''
                            passInputRef.current.value = ''
                            pass2InputRef.current.value = ''
                        } else {
                            oldpassInputRef.current.value = ''
                            alert('New passwords missmatch!')
                        }                    
                        //console.log("passw correct")
                    } else {
                        alert("Wrong old password!")
                        oldpassInputRef.current.value = ''
                    }
                }
                checkPass()            
            }
            getUserData()
        } else {
            oldpassInputRef.current.value = ''
            alert("Password must be at least 6 symbols!")
        }
        
    }

    const handleChangeName = (event) => {
        event.preventDefault()
    
        // Perform registration logic here
        const newName = newNameInputRef.current.value
        
        if(newName.length > 2) {
            const updateDb = async() => {
                const userRef = doc(db, "sws-users", props.user.id)
                await updateDoc(userRef, { name: newName })
                newNameInputRef.current.value = ''
                props.updateName(newName)
                alert("Name successfully changed.")
            }
            updateDb()
        } else {
            alert("Name must be at least 3 symbols length!")
        }

    }

    function handleClearOrders(event) {

    }

    function handleDelUser(event) {

    }

    function handleChangeTheme(event) {

    }

   
    
    return (
        <div className="user-settings">
            <p className="usersettings-block"><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p className="user-settings-title">Change password:</p>
            
            <form name="changePasswForm" className="usersettings-form" onSubmit={handleChangePassw} >
                <p className="usersettings-block">     
                    <span className="settings-inputs">
                        <input type="password" className="input" name="oldpassw" placeholder="Old password" ref={oldpassInputRef} required />
                        <input type="password" className="input" name="passw" placeholder="New password" ref={passInputRef} required />
                        <input type="password" className="input" name="passw" placeholder="Repeat new password" ref={pass2InputRef} required />
                        <button type="submit" className="btn">Confirm</button>
                        {/* <input type="password" className="input" name="oldpassw" placeholder="Old password" required value={changePasswData.oldPassw} onChange={handleChangePassw} />
                        <input type="password" className="input" name="passw" placeholder="New password" required value={changePasswData.passw} onChange={handleChangePassw} />
                        <input type="password" className="input" name="passw" placeholder="Repeat new password" required value={changePasswData.passw2} onChange={handleChangePassw} />
                        <button type="submit" className="btn">Login</button> */}
                    </span>
                </p>    
            </form>            
            <p>Name: {props.user.level===1 && <span className="user-admin">Admin</span>}<span> {props.user.name}</span></p>
            <p className="user-settings-title">Change name:</p>           
            <form name="changeNameForm" className="usersettings-form" onSubmit={handleChangeName} > 
                <p className="usersettings-block">
                    <span className="settings-inputs">
                        <input type="text" className="input" name="nname" placeholder="New name" ref={newNameInputRef} required />                        
                        <button type="submit" className="btn">Confirm</button>
                        
                    </span>
                </p>    
            </form>            
            <p className="user-settings-title">Orders:</p>
            <p className="usersettings-block"><button className="btn" onClick={handleClearOrders}>Clear order data</button></p>
            <p className="user-settings-title">Color theme:</p>            
            <form name="themeForm" className="theme-form" onSubmit={handleChangeTheme} > 
                <p className="usersettings-block">
                    <span className="settings-inputs">
                        <input type="text" className="input" name="name" placeholder="New name" ref={newThemeInputRef} required />                        
                        <button type="submit" className="btn">Confirm</button>
                        
                    </span>
                </p>    
            </form>            
            <p className="user-settings-title">Delete user:</p>            
            <form name="delUserForm" className="usersettings-form" onSubmit={handleDelUser} > 
                <p className="usersettings-block">
                    <span className="settings-inputs">
                        <input type="password" className="input" name="passw" placeholder="Current password" ref={delUserInputRef} required />
                        <button type="submit" className="btn btn-red">Delete</button>
                        
                    </span>
                </p>
            </form>
            
            
            
        </div>
    )
    
}