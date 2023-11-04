import React from "react"
import dbQuery from "../functions/dbQuery"
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
  } from "firebase/firestore"
import { db } from "../firebase"

export default function Cart(props) {
    const [products, setProducts] = React.useState([])
    const storage = JSON.parse(localStorage.getItem("cart"))
    const text = props.login?"purchase":"Please, login or create new account"
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
                }
        }
        getAll()        
    }, [])

    console.log("storage", storage)
    console.log("prodsp", products)

    function removeFromCart(itemId) {
        console.log(storage.filter(item => item.itemId === itemId))
    }

    function getCartItems() {
        let cartItems = null
        
        if (storage?.length>0) {
            cartItems =
                <> 
                    <table border={1}>
                        <thead>
                            <tr>
                                <td></td>
                                <td>Title</td>
                                <td>Quantity</td>                                    
                                <td>Price</td>
                                <td>Total</td>
                                <td></td>                               
                            </tr>
                        </thead>
                        <tbody>
                        {
                            storage.map(item => {
                                let imageSrc, priceTotal
                                const prodItem = products.filter(prod => (prod.id === item.itemId))
                                try {
                                    imageSrc = require(`../img/products/fruits/${prodItem[0]?.photos[0]}`)
                                } catch(err) {            
                                    imageSrc = require(`../img/empty_img.png`)
                                }
                                priceTotal = parseFloat((prodItem[0]?.price * item.quantity).toFixed(2))
                                grandTotal=grandTotal+priceTotal
                                return ( 
                                    <tr key={item.itemId}>
                                        <td><img 
                                                src={imageSrc}
                                                className="product-item-thumb" 
                                            />
                                        </td>
                                        <td>{prodItem[0]?.title}</td>
                                        <td>{item.quantity}</td>                                    
                                        <td>{prodItem[0]?.price}</td>
                                        <td>{priceTotal}</td>
                                        <td><button className="btn" onClick={() => removeFromCart(item.itemId)}>Remove</button></td>                                        
                                    </tr>
                                )
                            }
                        )}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>                                    
                            <td>To pay:</td>
                            <td>{parseFloat(grandTotal.toFixed(2))}</td>
                            <td></td>                               
                        </tr>

                        </tfoot>
                    </table>

                </>
        }
        grandTotal = 0
       // console.log(cartItems)
        return cartItems
    }

    
    return (
        <div className="cart">
            {getCartItems()}
            {storage?.length>0?text:"Cart is empty."}
            {props.login && <button className="btn">Purchase</button>}

        </div>
    )
}