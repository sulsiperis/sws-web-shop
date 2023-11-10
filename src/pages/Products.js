import React from "react";
import Product from "../pages/Product";
import dbQuery from "../functions/dbQuery"
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
 
    function handleSubmit(event) {
        event.preventDefault()
        const pageExist = async() => {
            const pagesArr =  await dbQuery("sws-pages", db, false, ["__name__", "==", props.currentPage])
           // console.log(pagesArr)
            //check if it's a new page or editing old one
            if (pagesArr.length > 0) {
                if ((formData.title !=="") && (formData.content!=="")) {
                    const updateDb = async() => {
                        const pageRef = doc(db, "sws-pages", props.currentPage)
                        await updateDoc(pageRef, { 
                            title: formData.title, 
                            content: formData.content, 
                            order: formData.order 
                        })
                    }

                    //need to trigger pagesRaw state update after save

                    updateDb().then((err) => err?alert("Content NOT changed. Error: " + err):alert("Content successfully changed!"))
                    .then(props.triggerReloadPages())
                }
                //new page
            } else {
                
                const newPageArr = props.pages[props.pages.length-1]
                delete newPageArr.uid

                console.log("new Page", newPageArr)

                const addPage = async() => await addDoc(collection(db, "sws-pages"), newPageArr)
                addPage().then((err) => err?alert("Page NOT created. Error: " + err):alert("New page created!"))
                .then(props.triggerReloadPages())
            }

        }
        pageExist()

        /*  */
    }

    function handleDeletePage(event) {
        event.preventDefault()
        if (window.confirm("Are you sure to delete this page and all sub-pages?")) {
            
        }
        //check if has children
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
    function handleShowProduct(prodObj) {
        props.setShowProduct(prodObj)
    }
    function handleHideProduct() {
        props.setShowProduct()
    }
    
    const prods = props.items.map(prod => {      
        let imageSrc
        try {
            imageSrc = require(`../img/products/fruits/${prod.photos[0]}`)
        } catch(err) {            
            imageSrc = require(`../img/empty_img.png`)
        }
        return ( 
            <div className="product-item" key={prod.uid}>
                <img 
                    src={imageSrc}
                    className="product-item-thumb" 
                />
                {/* <ImageGallery items={images} showThumbnails={false} /> */}
                <span className="product-item-title" onClick={() => handleShowProduct(prod)}>{prod.title}</span>
                <div className="product-item-info-wrapper">
                    
                        <span className="product-item-price">{prod.price}€</span>
                        <span className="product-item-stock">{prod.stock>0?prod.stock:"Out of stock!"}</span>
                        {prod.stock>0 && <button className="btn" onClick={() => addToCart(prod.uid)}>Add to cart</button>}

                </div>
            </div>
        )
    })
    return (

        props.showProduct? 
            <Product prod={props.showProduct} close={handleHideProduct} addToCart={addToCart} />: 
            props.user && props.user.level<4?
            <>
                <div className="editor-txt">
                    <form name="catalog_page_form" onSubmit={(event) => handleSubmit(event)}>
                        <span>Page title:</span>
                        <input className="input" name="title" type="text" required onChange={handleChange} value={formData.title} />
                        <span>Page content:</span>
                        <textarea className="input editor-content" name="content" required onChange={handleChange} value={formData.content} />
                        <span>Order:</span>
                        <input className="input" name="order" type="number" min={1} max={1000} onChange={handleChange} value={formData.order} />
                        <span>Page type:</span>
                        <select name="type_id" className="input" value={formData.type_id} onChange={handleChange}>
                            <option value={200}>Catalog</option>
                            <option value={100}>Text page</option>
                            
                        </select>
                        <div className="editor-txt-buttons">
                            <button type="submit" className="btn">Save</button> 
                            <button className="btn txt-red" onClick={handleDeletePage}>Delete page</button>
                        </div>
                    </form>
                </div>
                <div className="products">{prods}</div>
            </>

            :<div className="products">
                {nArr[0]?.content}
                {prods}
            </div> 
    )
}