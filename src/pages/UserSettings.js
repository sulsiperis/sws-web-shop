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
    const [themeData, setThemeData] = React.useState(props.user.color_theme)
    
    const oldpassInputRef = useRef(null)
    const passInputRef = useRef(null)
    const pass2InputRef = useRef(null)
    const newNameInputRef = useRef(null)
    const delUserInputRef = useRef(null)


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
    //checks given @passw of current logged in user with db and returns true if correct, false if not
    async function checkPassw(passw) {
        const userData = await dbQuery("sws-users", db, false, ["__name__", "==", props.user.id])
        const checkPass = async() => {
            const passwHash = await bcrypt.compare(passw, userData[0].data().passw)
            return passwHash
        }
        return checkPass()
        
    }
    
    const handleChangePassw = (event) => {
        event.preventDefault()
    
        // Perform registration logic here
        const oldPass = oldpassInputRef.current.value
        const pass = passInputRef.current.value
        const pass2 = pass2InputRef.current.value

        let isCorrect = false

        if ((pass.length > 5) && (oldPass.length > 0)) {

            const cp = async() => {
                isCorrect = await checkPassw(oldPass)
                if (isCorrect) {
                    
                    //console.log(checkPassw(oldPass))
                    if(pass === pass2) {
    
                        updatePassw(pass)
                        alert("Password changed successfully.")
                        
                        oldpassInputRef.current.value = ''
                        passInputRef.current.value = ''
                        pass2InputRef.current.value = ''
                    } else {
                        oldpassInputRef.current.value = ''
                        alert('New passwords missmatch!')
                    }
                } else {
                    alert("Wrong old password!")
                    oldpassInputRef.current.value = ''
                }
            }
            cp()
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

    async function handleClearOrders(msg=true) {
        if (!msg || window.confirm("Are you sure to delete all orders data?")) {

            //delete orders 
            const q = query(collection(db, "sws-orders"), where("user_id", "==", props.user.id))
            try {
                const querySnapshot = await getDocs(q)
                if (querySnapshot.docs.length>0) {
                    
                    querySnapshot.forEach((d) => {
                        const docRef = doc(db, "sws-orders", d.id)
                        const dd = async() => {
                            await deleteDoc(docRef)
                        }
                        dd()
                        msg && alert("Orders data erased successfully.")
                    })
                } else {
                    msg && alert("No orders to delete.")
                }
                
            } catch (err) {                
                    console.log("ERROR!: " + err)
                    return false
            }

            
        } 
    }

    function handleChangeTheme(event) {
        //console.log(event.target.value)
        setThemeData(event.target.value)
    }

    function changeTheme(event) {
        event.preventDefault()
        const updateDb = async() => {
            const userRef = doc(db, "sws-users", props.user.id)
            await updateDoc(userRef, { color_theme: themeData })
            
            props.updateTheme(themeData)
            alert("Theme successfully changed.")
        }
        updateDb()
    }

    function handleDelUser(event) {
        event.preventDefault()
        const pass = delUserInputRef.current.value

        const cp = async() => {
            const isCorrect = await checkPassw(pass)
            if (isCorrect) {
                
                if (window.confirm("Are you sure to delete your account and all data?")) {
                    handleClearOrders(false)
                    const dd = async() => {
                        await deleteDoc(doc(db, "sws-users", props.user.id))
                    }
                    dd()
                    props.handleLogout(true)
                }
            } else {
                alert("Wrong password!")
                
            }
            delUserInputRef.current.value = ''
        }
        cp()
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
            <p>Name: <span className="user-settings-username"> {props.user.name}</span> {props.user.level===1 && <span className="user-admin">(Admin)</span>}</p>
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
            <form name="themeForm" className="theme-form" onSubmit={changeTheme} > 
                <p className="usersettings-block">
                    <span className="settings-inputs">
                        <span>
                            <input 
                                type="radio"
                                id="default"
                                name="theme"
                                value="default"
                                checked={themeData === "default"}
                                onChange={handleChangeTheme}
                            /><label htmlFor="default" >Default</label>
                            <input 
                                type="radio"
                                id="1"
                                name="theme"
                                value="1"
                                checked={themeData === '1'}
                                onChange={handleChangeTheme}
                            />
                            <label htmlFor="21">Sky</label>
                            <input 
                                type="radio"
                                id="2"
                                name="theme"
                                value="2"
                                checked={themeData === '2'}
                                onChange={handleChangeTheme}
                            />
                            <label htmlFor="2">Emerald</label>
                            <input 
                                type="radio"
                                id="3"
                                name="theme"
                                value="3"
                                checked={themeData === '3'}
                                onChange={handleChangeTheme}
                            />
                            <label htmlFor="3">Greyscale</label>
                        </span>
                        <span>                       
                            <button type="submit" className="btn">Confirm</button>
                        </span>
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