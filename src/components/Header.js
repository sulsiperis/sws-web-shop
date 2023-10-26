export default function Header(props) {
    return (
        <div className="header">
            <span className="header-menu-toggle" onClick={props.menuShowHide}>☰</span>
           <img src={require(`../img/sws_logo.png`)} className="logo" onClick={props.changeIntro} />
           <div className="header-title">Simple Web Shop</div>
           <div className="header-email" onClick={props.contacts}>🕊</div>
           <div className="header-user" onClick={props.login}>웃</div>
        </div>
    )
    
}