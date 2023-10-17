export default function Menu() {
    return (
        <div className="menu">
            {/* <ul>
                <li>Home</li>
                <li>Categories</li>
                <ul>
                    <li>sub1</li>
                    <li>sub2</li>
                    <li>sub3</li>
                </ul>
                <li>Contacts</li>
                <li>User</li>
            </ul> */}
            <p>Home</p>
            <p>Categories ⯆</p>
            <ul>
                <li className="selected">sub1</li>
                <li>Long name from 3 words</li>
                <li>sub3</li>
            </ul>            
            <p className="selected">Contacts</p>
            <p>User ⯆</p> {/* only show when signed-in otherwise show Sign-in */}
            <ul>
                <li>Info</li>
                <li>Cart</li> {/* only shown if there is at least 1 item in cart */}
                <li>Settings</li>
                <li>Logout</li>
            </ul>
        </div>
    )
    
}