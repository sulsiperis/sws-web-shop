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
import { nanoid } from "nanoid";
const saltRounds = 12;

export default function UserSettings(props) { 
    const [themeData, setThemeData] = React.useState(props.user.color_theme)
    const [levelData, setLevelData] = React.useState({})

    
    const oldpassInputRef = useRef(null)
    const passInputRef = useRef(null)
    const pass2InputRef = useRef(null)
    const newNameInputRef = useRef(null)
    const delUserInputRef = useRef(null)

    React.useEffect(()=> {
        let newObj = {}
        props.users.map(usr => {
            return (
                newObj[usr.id] = usr.level                
            )
        })
        setLevelData(newObj)
    },[])

    

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

    //clears orders of current user by default or provided user id @param userId
    //@param msg triggers alert messages about progress if true
    async function handleClearOrders(msg=true, userId="") {
        if (!msg || window.confirm("Are you sure to delete all orders data?")) {

            //delete orders 
            const q = query(collection(db, "sws-orders"), where("user_id", "==", userId?userId:props.user.id))
            try {
                const querySnapshot = await getDocs(q)
                if (querySnapshot.docs.length>0) {
                    
                    const proceedDeletion = async() => await querySnapshot.forEach((d) => {
                        const docRef = doc(db, "sws-orders", d.id)
                        const dd = async() => {
                            await deleteDoc(docRef)
                        }
                        dd()                        
                    })
                    proceedDeletion().then((res) => {
                        if(res) {
                            msg?alert("Error. Orders not deleted!"):console.log("Error. Orders not deleted!")
                        } else {
                            msg && alert("Orders data erased successfully.")
                        }
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
    function changeLevel(event, userId) {
        event.preventDefault()

        const updateLvl = async() => {
            const userRef = doc(db, "sws-users", userId)
            await updateDoc(userRef, { level: Number(levelData[userId]) })
        }
        updateLvl().then((err) => err?alert("User's level not changed. Error: " + err):alert("User's level successfully changed!"))

    }
    function handleChangeLevel(event, userId) {
        event.preventDefault()
        setLevelData(oldVal => ({
            ...oldVal,
            [userId] : event.target.value
        }))
    }
    function deleteUser(userId) {
        if (window.confirm("Are you sure to delete user \""+props.users.filter(u=> u.id===userId)[0].name+"\" and all related data?")) {
            handleClearOrders(false, userId)
            const dUsr = async() => {
                await deleteDoc(doc(db, "sws-users", userId))
            }
            dUsr().then((err) => err?alert("Could not delete user beacuse error occured: " + err):props.updateDelUsers(userId))
            
        }
    }


    function AdminComp() {
            const userTbl = 
                <table className="orders_table">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Last seen</td>                                    
                            <td>Registered</td>
                            <td>Level</td>
                            <td></td>                               
                        </tr>
                    </thead>
                    <tbody>
                {
                    props.users.map(usr => {
                        let reg, last_seen, levelOptions = []
                        if(usr.registration_date) {
                            reg = usr.registration_date.toDate().toLocaleDateString()+ "  " +usr.registration_date.toDate().toLocaleTimeString()
                        }
                        if(usr.last_seen_date) {
                            last_seen = usr.last_seen_date.toDate().toLocaleDateString()+ "  " +usr.last_seen_date.toDate().toLocaleTimeString()
                        }
                        for (let i=1;i<10;i++) {
                            levelOptions.push(i)
                        }                        
                        return (
                            <tr key={usr.id}>                        
                                <td>{usr.name}</td>
                                <td>{usr.email}</td>                                    
                                <td>{last_seen}</td>
                                <td>{reg}</td>
                                <td>
                                    <form name={"form_" + usr.id} onSubmit={(event) => changeLevel(event, usr.id)}>
                                        <select 
                                            name="level"
                                            disabled={usr.id===props.user.id?true:false} 
                                            value={levelData[usr.id]} 
                                            onChange={(event) => handleChangeLevel(event, usr.id)}
                                        >
                                            {levelOptions.map(opt => <option key={nanoid()} value={opt}>{opt}</option>)}
                                        </select>
                                    
                                    {/* {usr.level} */}
                                    {usr.id !== props.user.id && <button className="btn" type="submit">OK</button>}
                                    </form>
                                </td>
                                <td>{usr.id !== props.user.id && <button className="btn" onClick={() => deleteUser(usr.id)}>Delete</button>}</td>                                        
                            </tr> 
                        )
                    })
                }
                    </tbody>                    
                </table>

            //console.log(props.users)
        return (
            <>
                <p className="user-settings-title txt-red">Admin area:</p>
                <p className="usersettings-block"></p>
                <p className="user-settings-title">Users:</p>                
                    
                        {userTbl}
                <p className="usersettings-block"></p>
                
            </>
        )
        
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
                        <input type="text" className="input" name="name" placeholder="New name" ref={newNameInputRef} required />                        
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
            <p className="user-settings-title">Delete account:</p>            
            <form name="delUserForm" className="usersettings-form" onSubmit={handleDelUser} > 
                <p className="usersettings-block">
                    <span className="settings-inputs">
                        <input type="password" className="input" name="passw" placeholder="Current password" ref={delUserInputRef} required />
                        <button type="submit" className="btn txt-red">Delete</button>
                        
                    </span>
                </p>
            </form>
            
            {props.user.level===1 && <AdminComp />}
            
        </div>
    )
    
}