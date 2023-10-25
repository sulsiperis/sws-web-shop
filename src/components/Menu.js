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

    let pagesLvl1Arr = []
    pagesLvl1Arr = props.pages && props.pages.filter(page => (page.type_id > 0) && !page.parent_id)
    pagesLvl1Arr.sort(function (a, b) {return a.order - b.order});
    console.log(pagesLvl1Arr)

    const pagesLvl1 = pagesLvl1Arr.map(page => {
        let hasChildren = false, pagesLvl2, pages = [] 
        const pagesLvl2Arr = props.getChildren(page.uid)        
        if (pagesLvl2Arr.length > 0) {
            pagesLvl2Arr.sort(function (a, b) {return a.order - b.order});
            hasChildren = true
            pages = pagesLvl2Arr.map(page => {
                return (
                    <li
                        key={page.uid} 
                        onClick={() => props.selectPage(page.uid)}
                        className={props.currentPage===page.uid?"selected":"" }
                    >{page.title}</li>
                )
            })
            pagesLvl2 = <ul>{pages}</ul>
            //console.log(page.title + " turi vaiku: " + props.getChildren(page.uid).length)
        }
        return ( 
            <span key={page.uid}>
            <p
                
               onClick={() => props.selectPage(page.uid)}
               className={props.currentPage===page.uid?"selected":"" }
            >{page.title}{hasChildren && " ⯆"}</p>
            
            {hasChildren && pagesLvl2}
            
            
            </span>
        )
    })

    return (
        <div className="menu">
            {pagesLvl1}
            {/* <p>Home</p>
            <p>Categories{ props.categories?.length>0 && ' ⯆'}</p>
            <ul> */}
                {/* cats */}
                {/* <li className="selected">sub1</li>
                <li>Long name from 3 words</li>
                <li>sub3</li> */}
            {/* </ul>            
            <p className="selected">Contacts</p>
            <p>About</p>
            <p>User ⯆</p>  only show when signed-in otherwise show Sign-in 
            <ul>
                <li>Info</li>
                <li>Cart</li>  only shown if there is at least 1 item in cart 
                <li>Settings</li>
                <li>Logout</li>
            </ul> */}
        </div>
    )
    
}