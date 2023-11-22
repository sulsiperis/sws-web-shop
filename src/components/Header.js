export default function Header(props) {
    return (
        <div className="header">
            <span className="header-menu-toggle" onClick={props.menuShowHide}>☰</span>
           <img src={require(`../img/sws_logo.png`)} className="logo" onClick={props.changeIntro} />
           <div className="header-title">Simple Web Shop</div>
           <div className="header-buttons-wrapper-col"> 
                <div className="header-buttons-wrapper-row">
                    <span className="far fa-envelope header-eml" onClick={props.contacts}></span>
                    <span className="far fa-user header-usr" onClick={props.login}></span>

                    
                </div>
                
                { props.login && props.loggedInName && 
                    <div className="header-hello">Hello, {props.loggedInName}</div> 
                }
            </div>     
        </div>
    )
    
}