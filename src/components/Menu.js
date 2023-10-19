export default function Menu(props) {
    const sortedCats = props.categories.sort(function(a, b){return a.id - b.id});
    //console.log(sortedCats)

    const cats = sortedCats.map(cat => {
        return ( 
            <li
               key={cat.uid} 
               onClick={() => props.selectCat(cat.id)}
               className={props.currentCat===cat.id?"selected":"" }
            >{cat.title}</li>
        )
    })        


    return (
        <div className="menu">
          
            <p>Home</p>
            <p>Categories{ props.categories?.length>0 && ' ⯆'}</p>
            <ul>
                {cats}
                {/* <li className="selected">sub1</li>
                <li>Long name from 3 words</li>
                <li>sub3</li> */}
            </ul>            
            <p className="selected">Contacts</p>
            <p>About</p>
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