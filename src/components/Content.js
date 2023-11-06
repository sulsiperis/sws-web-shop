import React from "react";
import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu"
import ContentCart from "./ContentCart";
//pages:
import Products from "../pages/Products";
import LoginSignup from "../pages/LoginSignup";
import TextPage from "../pages/TextPage";
import UserInfo from "../pages/UserInfo";
import UserSettings from "../pages/UserSettings";
import Cart from "../pages/Cart";


import { 
    collection,
    onSnapshot, 
    addDoc, //adds collection to db
    doc, //reference to specific item (autogenerate id)
    deleteDoc, //delete db item
    updateDoc, //updates doc
    setDoc, //adds or overwrites doc
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
    FieldPath
  } from "firebase/firestore"
import { db } from "../firebase"
import dbQuery from "../functions/dbQuery";
import ImageGallery from "react-image-gallery";
import { useCookies } from "react-cookie";

export default function Content(props) {
    

    const [pages, setPages] = React.useState([])
    const [pagesRaw, setPagesRaw] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState()
    const [curPageType, setCurPageType] = React.useState(0)
    const [currentCat, setCurrentCat] = React.useState()
    const [productsItems, setProductsItems] = React.useState([])
    const [allProducts, setAllProducts] = React.useState([])
    const [showCart, setShowCart] = React.useState(true)
    const [showProduct, setShowProduct] = React.useState()
    const [toggleMenu, setToggleMenu] = React.useState(true)
    const [cartContent, setCartContent] = React.useState(JSON.parse(localStorage.getItem("cart")))
    const [cartTotals, setCartTotals] = React.useState({"cartTotal": 0, "cartItems": 0})
    const [login, setLogin] = React.useState(false)
    const [uInfo, setUInfo] = React.useState()
    const [users, setUsers] = React.useState()

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
     
    const ContentTitle = () => {
        const curPageArr =  pages.filter(page => page.uid === currentPage)
        if (curPageArr.length>0) {
            return curPageArr[0].title
        } else {
            return false
        }

    }


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

    React.useEffect(() => {
        const getProds = async () => {
            const cdata2 = await dbQuery("sws-products", db, true)
            //console.log(cdata2)
            const nArr2 = cdata2.map(prod => ({
                ...prod.data(),
                uid: prod.id
            }))
            
            setAllProducts(nArr2)
        }
        getProds()
    
    }, [])

    //pages hook:
    React.useEffect(() => {
        cookies.user && setLogin(true)
        const fetchData = async () => {
            const cdata = await dbQuery("sws-pages", db, true)
            const nArr = cdata && cdata.map(pg => ({
                ...pg.data(),
                uid: pg.id
            }))
            setPagesRaw(nArr)
            
         
        }
        fetchData()
        
        
    }, [])

    //cookie auto expiration hook
    React.useEffect(() => {
        !cookies.user && login && handleLogout()
          
    }, [cookies.user])



    //load all users hook
    React.useEffect(() => {       
        const qUsers = async () => {
            const q = await dbQuery("sws-users", db, true)                
            if (q.length>0) {
                //console.log(q)
                const nArr3 = q.map(usr => ({
                    ...usr.data(),
                    "id": usr.id,
                                        
                }))
                //remove passw from array
                nArr3.forEach(v => delete v.passw );                
                setUsers(nArr3)                  
            }          
        }
        qUsers()
        
    }, [login])

    //cookie update hook on page change activity
    React.useEffect(() => {
        if (login && cookies.user) {
            const name = cookies.user.split("%")[0] , userId = cookies.user.split("%")[1] 
            handleCookie(name, userId)
        }
        setShowProduct()
    }, [currentPage, currentCat])


    //hook for loading user info, orders and filter pages for menu when user not logged in
    React.useEffect(() => {        
        if (login) {    
            setPages(pagesRaw)

            const getUserInfo = async() => {
                const userData = await dbQuery("sws-users", db, false, ["__name__", "==", cookies.user.split("%")[1]])
                if (userData[0]) {
                    setUInfo({
                        "id":userData[0].id,
                        "name":userData[0].data().name,
                        "email":userData[0].data().email, 
                        "level":userData[0].data().level,
                        "last_seen":userData[0].data().last_seen_date,
                        "reg_date":userData[0].data().registration_date,
                        "color_theme": userData[0].data().color_theme 
                    })
                }
            }            
            getUserInfo()
            
        } else {
            const userPagesFiltered = pagesRaw.filter(page => (page.type_id !== 21) && 
                                                   // (page.type_id !== 22) && 
                                                    (page.type_id !== 23) && 
                                                    (page.type_id !== 24) &&
                                                    (page.type_id !== 2)
                                                )
            setPages(userPagesFiltered)
        }
        
    }, [login, pagesRaw])
    
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


    //product gallery hook and special pages redirection by type:
    React.useEffect(() => {
        
        //categories file type 
        if (curPageType === 200) {
            const curentPageArr = pages.filter(page => (page.uid === currentPage))

            curentPageArr[0].options.type === "category" && setCurrentCat(curentPageArr[0]?.options.category_id)
        } else {
            setCurrentCat(false)
            setProductsItems([])
            //home menu item
            curPageType === 1 && props.changeIntro()
            //logout menu item
            curPageType === 24 && handleLogout()
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

    //when single product item clicked
    
    
    function pageChange(id) {
       
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
            
            return qData[0].data().type_id
        } else {
            return false
        }
    }
    function getPageType(id) {
        if (id) {
            const qData = pagesRaw.filter(page => (page.uid === id))
         
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
            const qData = pagesRaw.filter(page => (page.type_id === typeId))
            return qData
        } else {
            return false
        }
    }
        
    async function loginCheck() {
            if (login) {
                //go to user info page
                setCurrentPage(getPagesOfType(21)[0].uid)
                //when user is logged in
                //probably get page by type_id and setCurrentPage to user
            } else {
                
                //login/sign-up page hidden from menu hierarchy
                const pages = getPagesOfType(999999)
                setCurrentPage(pages[0].uid)
            }
      
    }
    //cookie auto expire after 12 min of inactivity.
    function handleCookie(userName, userId) {
        setCookie("user", userName + "%" + userId, { maxAge: 60*12, sameSite: 'lax' });  
    }

    function handleLogin(lState) {
        setLogin(lState)
        //redirect to user info page if login successful
        setCurrentPage(getPagesOfType(21)[0].uid)
    }

    async function setLastSeen(userId) {
        const userRef = doc(db, "sws-users", userId?userId:cookies.user.split("%")[1])
        await updateDoc(userRef, { last_seen_date: new Date() })

    }

    function handleLogout(delUser=false) {        
        cookies.user && removeCookie("user", {sameSite: 'lax'})
       
        if(login) {
            !delUser && uInfo.id && setLastSeen(uInfo.id)
            setUInfo()
            setLogin(false)
        }
    }

    //when contacts button on header is clicked
    function contactsPage() {
        let contactsUid
        for(let i=0;i<pages.length;i++) {
            if(pages[i].options?.type) {
                if (pages[i].options.type === "contacts") {
                    contactsUid = pages[i].uid
                }
            }
        }
        contactsUid && setCurrentPage(contactsUid)        
    }

    //when "view cart" is pressed on card notifier
    function cartPage() {
        const cartObj =  getPagesOfType(22)
        cartObj.length>0 && setCurrentPage(cartObj[0].uid)
    }

    //prototype func for redirecting to specific page
    //@param pageId - go to page with provided id
    //@param typeId - go to first page of typeId
    //@param optionType - go to first page of optionType
    //At least one param must be specified. Otherwise will redirect 
    //to first child and if there is no childs - to home page.
    
    function goToPage(pageId="", typeId=null, optionType="") {

    }

    function updateName(newName) {
        setUInfo(val => {
            return {
                ...val,
                name: newName
            }
        })
    }

    function updateTheme(theme) {
        setUInfo(val => {
            return {
                ...val,
                color_theme: theme
            }
        })
    }
    function updateDelUsers(userId) {
        setUsers(users.filter(usr => usr.id !== userId))
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
                        loggedInName={uInfo?.name}
                    />            
                    <div className="content">
                        {showCart && <ContentCart 
                                        updateCart={updateCartContent} 
                                        cartDetails={cartTotals} 
                                        cartPage={cartPage} 
                                    />}
                        <div className="content-title"><span>{ContentTitle()}</span></div>
                        
                        {curPageType===999999 && <LoginSignup 
                                                    handleLogin={handleLogin} 
                                                    handleCookie={handleCookie} 
                                                    users={users} 
                                                />}
                        {curPageType===100 && <TextPage pages={pages} id={currentPage} user={uInfo} />}
                        {curPageType===21 && login && uInfo && <UserInfo 
                                                                    user={uInfo} 
                                                                    handleLogout={handleLogout} 
                                                                    prod={allProducts} 
                                                                />}
                        {curPageType===22 && <Cart 
                                                user={uInfo} 
                                                prod={allProducts} 
                                                login={login}
                                                pageChange={pageChange}
                                                updateCart={updateCartContent} 
                                            />}
                        {curPageType===23 && login && uInfo && <UserSettings 
                                                                    user={uInfo}
                                                                    users={users} 
                                                                    handleLogout={handleLogout} 
                                                                    updateName={updateName} 
                                                                    updateTheme={updateTheme}
                                                                    updateDelUsers={updateDelUsers}
                                                                />}
                        <Products 
                            items={productsItems} 
                            updateCart={updateCartContent} 
                            currentPage={currentPage}
                            currentCat={currentCat}
                            showProduct={showProduct}
                            setShowProduct={(prodObj) => setShowProduct(prodObj)}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}