export default function UserSettings(props) {    
    return (
        <div className="user-settings">
            <p><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p>Name: {props.user.level===1 && <span className="user-admin">Admin</span>}<span> {props.user.name}</span></p>
            <p>Registered: <span>adfasdfdfs</span></p>
            <p>Last login: <span>23532523</span></p>
            <p>Theme: <span>{props.user.color_theme}</span></p>
        </div>
    )
    
}