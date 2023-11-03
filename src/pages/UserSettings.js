import React, {useRef} from "react"

export default function UserSettings(props) { 


    const oldpassInputRef = useRef(null)
    const passInputRef = useRef(null)
    const pass2InputRef = useRef(null)
    const newNameInputRef = useRef(null)
    const delUserInputRef = useRef(null)
    
    const handleChangePassw = (event) => {
        event.preventDefault()
    
        // Perform registration logic here
        const oldPass = oldpassInputRef.current.value
        const pass = passInputRef.current.value
        const pass2 = pass2InputRef.current.value
    
        // Reset input fields
        oldpassInputRef.current.value = ''
        passInputRef.current.value = ''
        pass2InputRef.current.value = ''
    
        // Additional registration logic
    }

    const handleChangeName = (event) => {
        event.preventDefault()
    
        // Perform registration logic here
        const newName = newNameInputRef.current.value
       // Reset input fields
        newNameInputRef.current.value = ''
        
        // Additional registration logic
    }

    function handleClearOrders(event) {

    }

    function handleDelUser(event) {

    }

   
    
    return (
        <div className="user-settings">
            <p><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p><h4>Change password:</h4></p>
            <p>
                <form name="changePasswForm" className="usersettings-form" onSubmit={handleChangePassw} > 
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
                </form>
            </p>
            <p>Name: {props.user.level===1 && <span className="user-admin">Admin</span>}<span> {props.user.name}</span></p>
            <p><h4>Change name:</h4></p>
            <p>
                <form name="changePasswForm" className="usersettings-form" onSubmit={handleChangeName} > 
                    <span className="settings-inputs">
                        <input type="text" className="input" name="name" placeholder="New name" ref={newNameInputRef} required />                        
                        <button type="submit" className="btn">Confirm</button>
                        
                    </span>
                </form>
            </p>
            <p><h4>Orders:</h4></p>
            <p><button className="btn" onClick={handleClearOrders}>Clear order data</button></p>
            <p><h4>Color theme:</h4></p>
            <p>
                <form name="themeForm" className="theme-form" onSubmit={handleChangeName} > 
                    <span className="settings-inputs">
                        <input type="text" className="input" name="name" placeholder="New name" ref={newNameInputRef} required />                        
                        <button type="submit" className="btn">Confirm</button>
                        
                    </span>
                </form>
            </p>
            <p><h4>Delete user:</h4></p>
            <p>
                <form name="delUserForm" className="usersettings-form" onSubmit={handleDelUser} > 
                    <span className="settings-inputs">
                        <input type="password" className="input" name="passw" placeholder="Current password" ref={delUserInputRef} required />
                        <button type="submit" className="btn btn-red">Delete</button>
                        
                    </span>
                </form>
            </p>
            
            
        </div>
    )
    
}