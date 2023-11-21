import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu"
import ContentCart from "./ContentCart"
//pages:
import Products from "../pages/Products"
import LoginSignup from "../pages/LoginSignup"
import TextPage from "../pages/TextPage"
import UserInfo from "../pages/UserInfo"
import UserSettings from "../pages/UserSettings"
import Cart from "../pages/Cart"

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
import dbQuery from "../functions/dbQuery"
import { useCookies } from "react-cookie"
import { nanoid } from "nanoid"

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
    const [reloadPages, setReloadPages] =React.useState(false)
    const [reloadProds, setReloadProds] =React.useState(false)

    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
     
    const ContentTitle = () => {
        const curPageArr =  pages.filter(page => page.uid === currentPage)
        if (curPageArr.length>0) {
            return curPageArr[0].title
        } else {
            return false
        }

    }
 
    React.useEffect(() => {
        const getProds = async () => {
            const cdata2 = await dbQuery("sws-products", db, true)
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
            //cdata.then((err) => {
                if(!cdata) {
                    alert('Error while connecting to db!')
                } else {
                    const nArr = cdata.map(pg => ({
                        ...pg.data(),
                        uid: pg.id
                    }))

                    //console.log("reload triggered", nArr)

                    setPagesRaw(nArr)
                    reloadPages && setReloadPages(false)
                }            
            
            //})
            

        }
        fetchData()
        
    }, [reloadPages])

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

        //getTypeDb()
        //method with checking type from preloaded state of pages array     
        
        const getType = () => {
            const pType = getPageType(currentPage)            
            setCurPageType(pType)     
        }
        getType()
    }, [currentPage, reloadPages])


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
                    const nArr66 = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        uid: doc.id
                    }))
                    setProductsItems(nArr66)
                } catch (err) {
                    console.log("ERROR!: " + err)        
                }
            }
            getAll()
        }
        reloadProds && setReloadProds(false)
    }, [currentCat, reloadProds])


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
                count=count + cartContent[i].quantity
                total = total + (await findDbPrice(cartContent[i].itemId) * cartContent[i].quantity)
            }
        }
        //toFixed(2) rounds a number and returns a string with 2 decimals numbers
        setCartTotals({"cartTotal": total.toFixed(2), "cartItems": count})
    }

    //when single product item clicked
    function pageChange(id) {
        setShowProduct() //hides product when menu item clicked
        setCurrentPage(id)
    }
    function menuShowHide() {
        setToggleMenu(oldVal => !oldVal)
    }
    function updateCartContent(content) {
        setCartContent(content)
    }

    function getPageType(id) {
        if (id) {           
            const qData = pagesRaw.filter(page => (page.uid === id))
            if (qData.length>0) { 
                return qData[0].type_id 
            }            
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

    function addNewPage(parentId="") {
        const tempId = "new_"+nanoid()
        let nArr = pagesRaw
        nArr.push({
            uid: tempId,
            type_id: 100,
            title: "!new_page",
            parent_id: parentId,
            order: 999999,
            options: {},
            content: ""
        })
        setPagesRaw(nArr)
        setCurrentPage(tempId)
    }
  
    function triggerReloadPages() {
   // console.log("reload pages triggered")
        setReloadPages(true)
    }

    function findMaxCatId() {
        const cats = pages.filter(page => page.options?.type==="category")
        const max = cats.reduce((prev, current) => (prev && prev.options.category_id > current.options.category_id) ? prev : current, 0)
        return max.options.category_id
    }
    
      //saves page or creates a new one
    function savePage(event, formData) {
        event.preventDefault()
        const pageExist = async() => {
            const pagesArr =  await dbQuery("sws-pages", db, false, ["__name__", "==", currentPage])
           // console.log(pagesArr)
            //check if it's a new page or editing old one
            if (pagesArr.length > 0) {
                if ((formData.title !=="") && (formData.content!=="")) {
                    const updateDb = async() => {
                        const pageRef = doc(db, "sws-pages", currentPage)
                        await updateDoc(pageRef, { 
                            title: formData.title, 
                            content: formData.content, 
                            order: parseInt(formData.order, 10)
                        })
                    }
                    //need to trigger pagesRaw state update after save

                    updateDb().then((err) => {
                        err?alert("Content NOT changed. Error: " + err):alert("Content successfully changed!")
                        triggerReloadPages()
                    })
                    
                } else {
                    alert("Page Title and Page Content are mandatory!")
                }
                //new page
            } else {
                
                //if page type is a category:
                const opts = parseInt(formData.type_id, 10)===200?{ type: "category", category_id: findMaxCatId()+1 }:{} 

                const newPageArr = {
                    type_id: parseInt(formData.type_id, 10),
                    options: opts,
                    order: parseInt(formData.order, 10),
                    parent_id: pages[pages.length-1].parent_id,
                    title: formData.title,
                    content: formData.content
                }


                //console.log("new Page", newPageArr)
                let newId = ""
                const addPg = async() => await addDoc(collection(db, "sws-pages"), newPageArr)
                addPg().then((res) => {
                    if (!res.id) {
                        alert("DB error. Page NOT created!")
                    } else {
                        alert("New page created successfully.")
                        triggerReloadPages()
                        newId = res.id  
                       // console.log(newId, "nid1")
                        pageChange(newId)
                                                    
                    }
                })               
                
            }

        }
        pageExist()
    }
    function handleSaveProduct(event, prodFormData) {
        event.preventDefault()
        

        const prodExist = async() => {
            const pagesArr =  await dbQuery("sws-products", db, false, ["__name__", "==", prodFormData.uid])
           // console.log(pagesArr)
            //check if product exists in db and update if so
            if (pagesArr.length > 0) {
                if ((prodFormData.title !=="") && (prodFormData.price!==null) && (prodFormData.stock!==null)) {
                    const updateDb = async() => {
                        const pageRef = doc(db, "sws-products", prodFormData.uid)
                        await updateDoc(pageRef, { 
                            title: prodFormData.title, 
                            description: prodFormData.description, 
                            price: parseFloat(parseFloat(prodFormData.price).toFixed(2)),
                            stock: parseInt(prodFormData.stock, 10),
                            photos: prodFormData.photos
                        })
                    }
                    //need to trigger pagesRaw state update after save

                    updateDb().then((err) => {
                        if(err) {
                            alert("Content NOT changed. Error: " + err)
                        } else {
                            alert("Content successfully changed!")
                            setReloadProds(true)
                            //close product preview
                            handleSetShowProducts()
                        }
                        
                    })
                   // .then(triggerReloadPages())
                } else {
                    alert('Product title, price and stock are mandatory!')
                }
                //new product
            } else {                
                
                const newProdArr = {
                    title: prodFormData.title,
                    description: prodFormData.description,
                    price: parseFloat(parseFloat(prodFormData.price).toFixed(2)),
                    stock: parseInt(prodFormData.stock, 10),
                    photos: prodFormData.photos,
                    date_added: new Date(),
                    category_id: parseInt(currentCat, 10)
                }

                //console.log("new Page", newPageArr)
                let newId = ""
                const addPg = async() => await addDoc(collection(db, "sws-products"), newProdArr)
                addPg().then((res) => {
                    if (!res.id) {
                        alert("DB error. Product not added!")
                    } else {                        
                        newId = res.id
                        setReloadProds(true)
                        //setCurrentCat(currentCat)
                        setShowProduct(productsItems.filter((pr => pr.uid===newId) ))
                       // console.log(newId, "nid1")
                        //pageChange(newId)
                        alert("New product added successfully.")
                        setShowProduct()
                    }
                })               
                
            }

        }
        prodExist()

    }
    
    function handleNewProduct() {
        const tempId = "new_"+nanoid()
        let nArr = productsItems
        const newObj = {
            uid: tempId,    
            title: "!new_product",
            description: "",
            price: parseFloat((0).toFixed(2)),
            stock: parseInt(0, 10),
            photos: [],
            date_added: new Date(),
            category_id: parseInt(currentCat, 10)
        }      
        nArr.push(newObj)
        setCurrentCat(currentCat)
        setShowProduct(newObj)
 
    }
    //console.log(curPageType)
   // console.log(productsItems)

    //deletes page and subpages. Need to implement deletion of the products
    function deletePage(event) {
        event.preventDefault()

        if (window.confirm(curPageType===200?"Are you want to delete this category and all it's products?":"Are you sure about deleting this page and all it's sub-pages?")) {
            const pageRef = doc(db, "sws-pages", currentPage)            
            
            try {
                const getChilds = async() => {
                    const childs = await getDocs(query(collection(db, "sws-pages"), where("parent_id", "==", currentPage)))
                    if (childs.docs.length>0) {                        
                        childs.forEach((d) => {
                            const childsRef = doc(db, "sws-pages", d.id)
                            const dd = async() => {
                                await deleteDoc(childsRef)
                            }
                            dd()                            
                        })
                    }
                }
                getChilds()

                const getProds = async() => {
                    const childs = await getDocs(query(collection(db, "sws-products"), where("category_id", "==", currentCat)))
                    if (childs.docs.length>0) {                        
                        childs.forEach((d) => {
                            const prodRef = doc(db, "sws-products", d.id)
                            const dd = async() => {
                                await deleteDoc(prodRef)
                            }
                            dd()                            
                        })
                    }
                }
                curPageType===200 && getProds()


                const delPage = async() => {
                    await deleteDoc(pageRef)
                }
                delPage().then((err) => {
                    if (err) {
                        alert("Could not delete page. Error: " + err)
                    } else {
                        alert("Page successfully deleted!")
                        triggerReloadPages()
                        pageChange(getPagesOfType(21)[0].uid)
                    }
                    
                })
                    

            } catch (err) {                
                    console.log("ERROR!: " + err)
                    return false
            }

        }
    } 

    function handleSetShowProducts(prodObj) {
        setShowProduct(prodObj)
    }

   // console.log("current page: ", currentPage, "curr page type: ", curPageType)
   // console.log("pages raw: ", pagesRaw)

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
                    user={uInfo}
                    addNewPage={addNewPage}
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
                        {/* test */}
                    {/* <button onClick={findMaxCatId}>cat</button> */}

                        {showCart && <ContentCart 
                                        updateCart={updateCartContent} 
                                        cartDetails={cartTotals} 
                                        cartPage={cartPage} 
                                    />}
                        <div className="content-title"><span onDoubleClick={triggerReloadPages}>{ContentTitle()}</span></div>
                        
                        {curPageType===999999 && <LoginSignup 
                                                    handleLogin={handleLogin} 
                                                    handleCookie={handleCookie} 
                                                    users={users} 
                                                />}
                        {curPageType===100 && <TextPage 
                                                    pages={pages} 
                                                    id={currentPage} 
                                                    user={uInfo} 
                                                    triggerReloadPages={triggerReloadPages}
                                                    pageChange={pageChange}
                                                    getPagesOfType={getPagesOfType}
                                                    handleSubmit={savePage}
                                                    handleDeletePage={deletePage}
                                                />}
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
                                                loginCheck={loginCheck}
                                            />}
                        {curPageType===23 && login && uInfo && <UserSettings 
                                                                    user={uInfo}
                                                                    users={users} 
                                                                    handleLogout={handleLogout} 
                                                                    updateName={updateName} 
                                                                    updateTheme={updateTheme}
                                                                    updateDelUsers={updateDelUsers}
                                                                />}
                        {curPageType===200 && <Products 
                            items={productsItems} 
                            updateCart={updateCartContent} 
                            currentPage={currentPage}
                            currentCat={currentCat}
                            showProduct={showProduct}
                            //setShowProduct={(prodObj) => setShowProduct(prodObj)}
                            setShowProduct={handleSetShowProducts}
                            pages={pages}
                            triggerReloadPages={triggerReloadPages}
                            triggerReloadProds={() => setReloadProds(true)}
                            user={uInfo}
                            handleSaveProduct={handleSaveProduct}
                            handleNewProduct={handleNewProduct}
                            handleSubmit={savePage}
                            handleDeletePage={deletePage}

                        />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}