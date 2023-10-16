export default function Header(props) {
    return (
        <div className="header">
           <img src={require(`../img/sws_logo.png`)} className="logo" onClick={props.changeIntro} />
           <h2 className="header-title">Simple Web Shop</h2>
           <span className="header-email">🕊</span>
           <span className="header-user">웃</span>
        </div>
    )
    
}