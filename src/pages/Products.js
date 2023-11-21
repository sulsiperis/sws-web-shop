import React from "react";
import Product from "../pages/Product";
import dbQuery from "../functions/dbQuery"
import { getImgUrl } from "../functions/files"
import { 
    collection,
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
import { getJsxFromStr } from "../functions/files"
import { DefaultEditor } from "react-simple-wysiwyg"


export default function Products(props) {
    const nArr = props.pages.filter(page => (page.uid === props.currentPage))
    const [formData, setFormData] = React.useState({
        "title": nArr[0]?.title,
        "content": nArr[0]?.content,
        "order": nArr[0]?.order,
        "type_id": nArr[0]?.type_id
    })

    React.useEffect(() => {
        setFormData({
            "title": nArr[0]?.title,
            "content": nArr[0]?.content,
            "order": nArr[0]?.order,
            "type_id": nArr[0]?.type_id
        })
    }, [props.currentPage])

    

/*     React.useEffect(() => {
        handleHideProduct()
    }, [props.currentPage, props.currentCat]) */




    function handleChange(event) {
        setFormData(oldVal => {
            return(
                {...oldVal, [event.target.name]: event.target.value}
            )
        
        })
    }    
    function checkQuantity(itemId, quantityToAdd) {
        const oldStorage = JSON.parse(localStorage.getItem("cart"));
        let existed
        if (oldStorage) {
            for (let i=0;i<oldStorage.length;i++) {
                if (itemId === oldStorage[i].itemId) {
                    oldStorage[i].quantity =  oldStorage[i].quantity + quantityToAdd
                    existed = oldStorage
                } 
            }
        }
        return existed
    }
    function addToCart(itemId, quantity=1) {        
        const oldStorage = JSON.parse(localStorage.getItem("cart"));        
        const itemAlreadyInCart = checkQuantity(itemId, quantity)
        let newStorage = []
        if(itemAlreadyInCart) {
            newStorage = itemAlreadyInCart
        } else {
            const item = {"itemId": itemId, "quantity": quantity}            
            if(oldStorage) newStorage = oldStorage
            newStorage.push(item)
        }
        localStorage.setItem("cart", JSON.stringify(newStorage));
        props.updateCart(newStorage)
        
    }
    function handleShowProduct(event, prodObj) {
        props.setShowProduct(prodObj)
    }
    function handleHideProduct() {
        props.setShowProduct()
    }

    
    /* function getImgUrl(url) {
        if (isUrl(url)) {
            return url
        } else {
            return `./img/products/${url}`
            
        }
    } */

    const prodItems = props.items.map(prod => {      
        /* let imageSrc
        try {
            imageSrc = require(`../img/products/fruits/${prod.photos[0]}`)
        } catch(err) {            
            imageSrc = require(`../img/empty_img.png`)
        } */
                
        
        return ( 
            <div className="product-item" key={prod.uid}>
                <div>
                    <span className="product-item-thumb" style={{backgroundImage: `url(${getImgUrl(prod.photos[0])})`, 
                        backgroundRepeat:"no-repeat" }}></span>
                </div>
                {/* <ImageGallery items={images} showThumbnails={false} /> */}
                <span className="product-item-title" onClick={(event) => handleShowProduct(event, prod)}>{prod.title}</span>
                <div className="product-item-info-wrapper">
                    
                        <span className="product-item-price">{prod.price}€</span>
                        <span className="product-item-stock">{prod.stock>0?prod.stock:"Out of stock!"}</span>
                        {prod.stock>0 && <button className="btn" onClick={() => addToCart(prod.uid)}>Add to cart</button>}

                </div>
            </div>
        )
    })
    function handleDeleteProduct (event, prodId) {
        event.preventDefault()
        if (window.confirm("Are you sure you want to remove this product from DB?")) {
            const prodRef = doc(db, "sws-products", prodId)
           
            try {               
                const delProd = async() => {
                    await deleteDoc(prodRef)
                }
                delProd().then((err) => err?
                    alert("Unable delete product. Error: " + err):alert("Product successfully removed!"))
                    .then(props.triggerReloadProds)
                    .then(handleHideProduct)
                    

            } catch (err) {                
                    console.log("ERROR!: " + err)
                    return false
            }

        }
    }
    function handleSaveProduct(event, prodFormData) {
        props.handleSaveProduct(event, prodFormData)
    }
//console.log(props.showProduct)

    return (

        props.showProduct? 
            <Product 
                prod={props.showProduct} 
                close={handleHideProduct} 
                addToCart={addToCart} 
                user={props.user} 
                handleSaveProduct={handleSaveProduct}
                handleDeleteProduct={handleDeleteProduct}
            />: 
            props.user && props.user.level<4?
            <>
                <div className="editor-txt">
                    <form name="catalog_page_form" onSubmit={(event) => props.handleSubmit(event, formData)}>
                        <span>Page title:</span>
                        <input className="input" name="title" type="text" required onChange={handleChange} value={formData.title} />
                        <span>Page content:</span>

                        <DefaultEditor name="content" value={formData.content} onChange={handleChange} />
                        {/* <textarea className="input editor-content" name="content" required onChange={handleChange} value={formData.content} /> */}


                        <span>Order:</span>
                        <input className="input" name="order" type="number" min={1} max={1000} onChange={handleChange} value={formData.order} />
                        <span>Page type:</span>
                        <select name="type_id" className="input" value={formData.type_id} onChange={handleChange}>
                            <option value={200}>Catalog</option>
                            <option value={100}>Text page</option>
                            
                        </select>
                        <div className="editor-txt-buttons">
                            <button type="submit" className="btn txt-green">Save</button> 
                            <button className="btn txt-red" onClick={(event) => props.handleDeletePage(event)}>Delete page</button>
                        </div>
                        <div className="product-item"></div>
                    </form>                    
                </div>
                <div className="products">
                    {prodItems}
                    {props.user?.level===1 && <span className="add txt-green" onClick={() => props.handleNewProduct()} >+</span> }
                </div>
            </>

            :<div className="products">                
                {getJsxFromStr(nArr[0]?.content)}
                {prodItems}                
            </div> 
    )
}