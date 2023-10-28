export default function Header(props) {
    return (
        <div className="header">
            <span className="header-menu-toggle" onClick={props.menuShowHide}>☰</span>
           <img src={require(`../img/sws_logo.png`)} className="logo" onClick={props.changeIntro} />
           <div className="header-title">Simple Web Shop</div>
           <div className="header-buttons-wrapper-col"> 
                <div className="header-buttons-wrapper-row">                                
                    <div className="header-email" onClick={props.contacts}><span>🕊</span></div>
                    <div className="header-user" onClick={props.login}><span>웃</span></div>
                </div>
                
                { props.login && props.loggedInName && 
                    <div className="header-hello">Hello, {props.loggedInName.split('%')[0]}</div> 
                }
            </div>     
        </div>
    )
    
}