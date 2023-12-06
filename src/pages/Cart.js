import React from "react"
import dbQuery from "../functions/dbQuery"
import { getImgUrl } from "../functions/files"
import { nanoid } from "nanoid"
import { 
    collection,
    onSnapshot, 
    addDoc, //adds collection to db
    doc, //reference to specific item
    updateDoc,
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
  } from "firebase/firestore"
import { db } from "../firebase"

export default function Cart(props) {
    const [products, setProducts] = React.useState([])
    const [postPurchase, setPostPurchase] = React.useState(false)
    const storage = JSON.parse(localStorage.getItem("cart"))
    const loginLink = (
            <span className="blink">Please, <a className="link_u" id="shake" onClick={props.loginCheck}>login or create new account</a> to finnish the order.</span>
    )
    const message = props.login?
                    postPurchase?"Thank you for buying from our web shop!":
                    !storage?"Cart is empty":""
                :!storage?"Cart is empty":loginLink
    let grandTotal=0
    
    React.useEffect(() => {        
        const getAll = async() => {
                const prods = await dbQuery("sws-products", db, true)
                
                if (prods) {
                    const nArr = prods.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    setProducts(nArr)
                } else {
                    alert("DB error!")
                }
        }
        getAll()/* .then((err) => err?console.log("prod loaderror, ", err):console.log("prods loades")) */        
    }, [])



    //console.log("storage", storage)
    //console.log(message)
    //console.log(props.user.id)

    function removeFromCart(itemId) {
        //console.log(storage.filter(item => item.itemId === itemId))
        const oldStorage = JSON.parse(localStorage.getItem("cart"));        
                
        const newStorage = oldStorage.filter(item => item.itemId !== itemId)
        localStorage.setItem("cart", JSON.stringify(newStorage))
        props.updateCart(newStorage)

        newStorage.length<1&&emptyCart()
    }

    //console.log(storage)

    function handlePurchase() {

        const proceedOrders = async() => await storage.forEach(element => {
            //add order info to history db
            const docRef = async() => await addDoc(collection(db, "sws-orders"), {
                user_id: props.user.id,
                quantity: element.quantity,
                price: products.filter(prod => (prod.id === element.itemId))[0]?.price,
                item_id: element.itemId,
                date: new Date()
                
            })
            docRef()
            //update stock
            
            const prodRef = doc(db, "sws-products", element.itemId)
            const updateStock = async() => await updateDoc(prodRef, {
                stock: products.filter(prod => (prod.id === element.itemId))[0]?.stock - element.quantity
            })
            updateStock()
        })
        proceedOrders().then((res) => {
            if (!res)  {
                alert("Order created successfully.")        
                setPostPurchase(true)
                emptyCart(false)
            } else {
                alert("Error adding order data to db!")
            }
        })
    }

    function emptyCart(msg=true) {
        if (msg) {
            if (window.confirm("Are you sure you want to remove all items from the cart?")) {
                localStorage.clear()
                props.updateCart(null)
            }
        } else {
            localStorage.clear()
            props.updateCart(null)
        }
    }

    function getCartItems() {
        let cartItems = null
        
        if (storage?.length>0) {
            cartItems =
                <> 
                    <table className="orders_table">
                        <thead>
                            <tr>
                                <td></td>
                                <td>Title</td>
                                <td>Quantity</td>                                    
                                <td>Price</td>
                                <td></td>                               
                            </tr>
                        </thead>
                        <tbody>
                        {
                            storage.map(item => {
                                let priceTotal=0
                                const prodItem = products.filter((prod) => (prod.id === item.itemId))
                                //console.log(prodItem.length>0 && prodItem[0].price)
                                priceTotal = prodItem.length>0 && prodItem[0].price && parseFloat((parseFloat(prodItem[0].price) * Number(item.quantity)).toFixed(2))
                                grandTotal=grandTotal+priceTotal

                                //console.log(prodItem[0]?.price, item.quantity)
                                return ( 
                                    <tr key={nanoid()}>
                                        <td>
                                            <span 
                                                className="product-item-thumb" 
                                                style={{backgroundImage: `url(${getImgUrl(prodItem[0]?.photos[0])})`, backgroundRepeat:"no-repeat" }}
                                            ></span>
                                        </td>
                                        <td>{prodItem[0]?.title}</td>
                                        <td>{item.quantity}</td>                                    
                                        <td>{prodItem[0]?.price.toFixed(2)}</td>
                                      
                                        <td><button className="btn txt-red" onClick={() => removeFromCart(item.itemId)}>X</button></td>                                        
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                                                                
                            <td>Total:</td>
                            <td>{grandTotal && grandTotal.toFixed(2)}</td>
                            <td>{props.login && storage?.length>0 && <button className="btn" onClick={handlePurchase}>Purchase</button>}</td>                               
                        </tr>

                        </tfoot>
                    </table>

                </>
        }
        grandTotal = 0
        //console.log(storage)
        return cartItems
    }

    
    return (
        <div className="cart">
            <div className="cart-message" >
                 {message}
            </div>
            {getCartItems()}
            <div className="cart-footer">
                {props.login && storage?.length>0 &&<button className="btn txt-red" onClick={emptyCart}>Empty cart</button>}
                
            </div>

        </div>
    )
}