import React from "react";
import Product from "../pages/Product";


export default function Products(props) {
    

/*     React.useEffect(() => {
        handleHideProduct()
    }, [props.currentPage, props.currentCat]) */

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
                        <span className="product-item-stock">{prod.stock}</span>
                        <button className="btn" onClick={() => addToCart(prod.uid)}>Add to cart</button>

                </div>
            </div>
        )
    })
    return (

        props.showProduct ? <Product prod={props.showProduct} close={handleHideProduct} addToCart={addToCart} /> : <div className="products">{prods}</div> 
    )
}