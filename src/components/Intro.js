export default function Intro(props) {

    return (
        <>
            <div className="intro-title" onClick={props.changeIntro}><p>Welcome to my simple web shop project</p></div>
            <div className="intro-content">
                <img src={require(`../img/sws_logo.png`)} className="intro-logo" onClick={props.changeIntro} />
            </div>
        </>
    )
    
}