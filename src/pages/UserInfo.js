export default function UserInfo(props) {

    let last_seen, reg
    if(props.user.reg_date) {
        reg = props.user.reg_date.toDate().toLocaleDateString()+ "  " +props.user.reg_date.toDate().toLocaleTimeString()
    }
    if(props.user.last_seen) {
        last_seen = props.user.last_seen.toDate().toLocaleDateString()+ "  " +props.user.last_seen.toDate().toLocaleTimeString()
    }
    return (
        <div className="userinfo">            
            <p><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p>Name: <span>{props.user.name}</span></p>
            <p>Registered: <span>{reg}</span></p>
            <p>Last login: <span>{last_seen}</span></p>
            <p>Theme: <span>{props.user.color_theme}</span></p>
            <p>Order history: <span>no orders yet</span></p>
          
        </div>
    )
    
}