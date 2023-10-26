import React from "react";
import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu"
import ContentCart from "./ContentCart";
import Products from "../pages/Products";
import LoginSignup from "../pages/LoginSignup";
import TextPage from "../pages/TextPage";
import { 
    collection,
    onSnapshot, 
    addDoc, //adds collection to db
    doc, //reference to specific item
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
    FieldPath
  } from "firebase/firestore"
import { db } from "../firebase"
import dbQuery from "../functions/dbQuery";
import ImageGallery from "react-image-gallery";

export default function Content(props) {
    

    const [pages, setPages] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState()
    const [curPageType, setCurPageType] = React.useState(0)
    const [currentCat, setCurrentCat] = React.useState()
    const [productsItems, setProductsItems] = React.useState([])
    const [showCart, setShowCart] = React.useState(true)
    const [toggleMenu, setToggleMenu] = React.useState(true)
    const [cartContent, setCartContent] = React.useState(JSON.parse(localStorage.getItem("cart")))
    const [cartTotals, setCartTotals] = React.useState({"cartTotal": 0, "cartItems": 0})
    const [login, setLogin] = React.useState(false)
    
    const ContentTitle = () => {
        const curPageArr =  pages.filter(page => page.uid === currentPage)
        if (curPageArr.length>0) {
            return curPageArr[0].title
        } else {
            return false
        }

    }
    //console.log(productsItems)
    //console.log(pages)

    /* const images = [
        {
          original: "https://picsum.photos/id/1018/1000/600/",
          thumbnail: "https://picsum.photos/id/1018/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
        {
          original: "https://picsum.photos/id/1015/1000/600/",
          thumbnail: "https://picsum.photos/id/1015/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
        {
          original: "https://picsum.photos/id/1019/1000/600/",
          thumbnail: "https://picsum.photos/id/1019/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
    ]; */

       //pages hook:
       React.useEffect(() => {
        
        const fetchData = async () => {
            const cdata = await dbQuery("sws-pages", db, true)
            const nArr = cdata && cdata.map(pg => ({
                ...pg.data(),
                uid: pg.id
            }))
            if (login) {
                setPages(nArr)
            } else {
                const userPagesFiltered = nArr.filter(page => (page.type_id !== 21) && 
                                                        (page.type_id !== 22) && 
                                                        (page.type_id !== 23) && 
                                                        (page.type_id !== 24) &&
                                                        (page.type_id !== 2)
                                                    )
                setPages(userPagesFiltered)
            }
           // console.log(nArr)
        }
        fetchData()
    }, [])
    
 

    //page type hook
    React.useEffect(() => {

        //method with checking type directly with db
        const getTypeDb = async () => {
            const pType = await getPageType(currentPage)            
            setCurPageType(pType)          
        }
        //getTypeDb()
        //method with checking type from preloaded state of pages array        
        const getType = () => {
            const pType = getPageType(currentPage)            
            setCurPageType(pType)     
        }
        getType()        
    }, [currentPage])

    //product gallery hook:
    React.useEffect(() => {
        //console.log(curPageType)
        //categories file type        
        if (curPageType === 200) {
            const curentPageArr = pages.filter(page => (page.uid === currentPage))
            //console.log(curentPageArr[0].options.type)
            curentPageArr[0].options.type === "category" && setCurrentCat(curentPageArr[0].options.category_id)
        } else {
            setCurrentCat(false)
            setProductsItems([])
            curPageType === 1 && props.changeIntro()
        }
    }, [curPageType, currentPage])

    //db query for products of selected category
    React.useEffect(() => { //here's field name from db and value (1)
        if (currentCat) {
            const q = query(collection(db, "sws-products"), where("category_id", "==", currentCat))
            //const q = collection(db, "sws-products")
            const getAll = async() => { 
                try {
                    const querySnapshot = await getDocs(q)
                    const nArr = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        uid: doc.id
                    }))
                    setProductsItems(nArr)
                } catch (err) {
                    console.log("ERROR!: " + err)        
                }
            }
            getAll()
        }
    }, [currentCat])


    //cart hook
    React.useEffect(() => {
        cartContent?.length>0?setShowCart(true):setShowCart(false)
        cartDetails()      
    }, [cartContent])

 
    function getChildren(parentId) {        
        let leveled = [], newArr = []
        for(let i=0;i<pages.length;i++) {
            if(pages[i].parent_id === parentId) {
                newArr.push(pages[i])
            }
        }
        return newArr
    }

    
    async function findDbPrice(itemId) {
        // __name__ is the document id identifier
        const q = query(collection(db, "sws-products"), where("__name__", "==", itemId))
        try {
            const querySnapshot = await getDocs(q)
            return querySnapshot.docs[0].data().price 
        } catch (err) {                
            console.log("ERROR!: " + err)        
            return false
        }
        
    }
    async function cartDetails() {
        let count = 0, total = 0
        if (cartContent) {
            for(let i=0;i<cartContent.length;i++) {
                
              //  console.log(findDbPrice(cartContent[i].itemId))

                count=count + cartContent[i].quantity
                total = total + (await findDbPrice(cartContent[i].itemId) * cartContent[i].quantity)
            }
        }
        //toFixed(2) rounds a number and returns 2 digis after dot
        setCartTotals({"cartTotal": total.toFixed(2), "cartItems": count})
    }
    
    


    function pageChange(id) {
        //console.log("clicked: " + id)
        setCurrentPage(id)
    }
    function menuShowHide() {
        setToggleMenu(oldVal => !oldVal)
    }
    function updateCartContent(content) {
        setCartContent(content)
    }


    async function getPageTypeFromDb(id) {
        if (id) {
            const qData = await dbQuery("sws-pages", db, false, ["__name__", "==", id])
            //console.log(await qData[0].data().type_id)
            return qData[0].data().type_id
        } else {
            return false
        }
    }
    function getPageType(id) {
        if (id) {
            const qData = pages.filter(page => (page.uid === id))
            //console.log(qData[0].type_id)
            return qData[0].type_id
        } else {
            return false
        }
    }
    async function getPagesOfTypeFromDb(typeId) {
        if (typeId) {
            const qData = await dbQuery("sws-pages", db, false, ["type_id", "==", typeId])
            return qData
        } else {
            return false
        }
    }
    function getPagesOfType(typeId) {
        if (typeId) {
            const qData = pages.filter(page => (page.type_id === typeId))
            return qData
        } else {
            return false
        }
    }
    
    async function loginCheck() {
        //console.log(curPageType)
        const pages = getPagesOfType(999999)
            if (login) {
                //whe n user logged in
                //probably get page by type_id and setCurrentPage to user
            } else {
                //console.log( pages[0].uid )
                setCurrentPage(pages[0].uid)
            }
      
    }
    function contactsPage() {
        const nArr = pages.filter(page => (page.options.type === "contacts"))
        if (nArr) {
            setCurrentPage(nArr[0].uid)
        }
    }
    return (
        <div className="main-wrapper">
            <div className="main">
                {toggleMenu && <Menu                    
                    products={productsItems}
                    currentCat={currentCat}
                    currentPage={currentPage}
                    selectPage={pageChange}
                    pages={pages}
                    getChildren={getChildren}
                />}
                <div className="g1">
                    <Header 
                        changeIntro={props.changeIntro}
                        menuShowHide={menuShowHide}
                        login={loginCheck}
                        contacts={contactsPage}
                    />            
                    <div className="content">
                        {showCart && <ContentCart updateCart={updateCartContent} cartDetails={cartTotals} />}
                        <div className="content-title">{ContentTitle()}</div>
                        <div>{curPageType}</div>
                        {curPageType===999999 && <LoginSignup />}
                        {curPageType===100 && <TextPage pages={pages} id={currentPage} />}
                        <Products items={productsItems} updateCart={updateCartContent} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}