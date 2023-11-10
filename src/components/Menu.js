export default function Menu(props) {
    
    let pagesLvl1Arr = []
    pagesLvl1Arr = props.pages && props.pages.filter(page => (page.type_id < 999999) && !page.parent_id)
    pagesLvl1Arr.sort(function (a, b) {return a.order - b.order});
    
    
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
                {(props.user?.level===1) && 
                    ((page.type_id === 100) || (page.type_id === 200)) && 
                    <span className="add indent-left" onClick={() => props.addNewPage(page.uid)} >+</span> }
            
            {hasChildren && pagesLvl2}
            
            
            </span>
        )
    })

    return (
        <div className="menu">
            {pagesLvl1}
            {props.user?.level===1 && <span className="add" onClick={() => props.addNewPage()} >+</span> }
        </div>
    )
    
}