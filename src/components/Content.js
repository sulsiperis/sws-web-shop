import React from "react";
import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu"
import ContentCart from "./ContentCart";
import Products from "./Products";
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
import ImageGallery from "react-image-gallery";

export default function Content(props) {
    const [categories, setCategories] = React.useState([])
    const [productsItems, setProductsItems] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState()
    const [currentCat, setCurrentCat] = React.useState()
    //temporary solution for showing individual product
    const [prodId, setProdId] = React.useState()
    const [showCart, setShowCart] = React.useState(true)
    const [toggleMenu, setToggleMenu] = React.useState(true)
    const [cartContent, setCartContent] = React.useState(JSON.parse(localStorage.getItem("cart")))
    const [cartTotals, setCartTotals] = React.useState({"cartTotal": 0, "cartItems": 0})
    //console.log(productsItems)

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
        const unsubscribe = onSnapshot(collection(db, "sws-categories"), function(snapshot) {         
            const nArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }))
            setCategories(nArr)                     
        })       
        return unsubscribe
    }, [])

    //db query for products of selected category
    React.useEffect(() => { //here's field name from db and value (1)
        if (currentCat) {
            const q = query(collection(db, "sws-products"), where("category-id", "==", currentCat))
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

    async function findDbPrice(itemId) {
        const q = query(collection(db, "sws-products"), where("__name__", "==", itemId))
       
        let price=0
         
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
        //let itemIdArr = []
        if (cartContent) {
            for(let i=0;i<cartContent.length;i++) {
                
              //  console.log(findDbPrice(cartContent[i].itemId))

                count=count + cartContent[i].quantity
                total = total + (await findDbPrice(cartContent[i].itemId) * cartContent[i].quantity)
                //itemIdArr.push(cartContent[i].itemId)             
            }
        }
        //toFixed(2) rounds a number and returns 2 digis after dot
        setCartTotals({"cartTotal": total.toFixed(2), "cartItems": count})
    }
    
    function catChange(id) {
        //console.log("clicked: " + id)
        setCurrentCat(id)
    }
    function menuShowHide() {
        setToggleMenu(oldVal => !oldVal)
    }
    function updateCartContent(content) {
        setCartContent(content)
    }
    return (
        <div className="main-wrapper">
            <div className="main">
                {toggleMenu && <Menu                    
                    categories={categories}
                    products={productsItems}
                    currentCat={currentCat}
                    selectCat={catChange}
                    currentPage={currentPage}
                />}
                <div className="g1">
                    <Header 
                        changeIntro={props.changeIntro}
                        menuShowHide={menuShowHide} 
                    />            
                    <div className="content">
                        {showCart && <ContentCart updateCart={updateCartContent} cartDetails={cartTotals} />}
                        <div className="content-title">Fruits</div>
                        <Products items={productsItems} updateCart={updateCartContent} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}