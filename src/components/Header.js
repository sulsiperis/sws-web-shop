export default function Header(props) {
    return (
        <div className="header">
            <span className="header-menu-toggle" onClick={props.menuShowHide}>☰</span>
           <img src={require(`../img/sws_logo.png`)} className="logo" onClick={props.changeIntro} />
           <div className="header-title">Simple Web Shop</div>
           <div className="header-email">🕊</div>
           <div className="header-user">웃</div>
        </div>
    )
    
}