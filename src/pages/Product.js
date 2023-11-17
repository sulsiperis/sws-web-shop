import React from "react"
import { isUrl, imageExists } from "../functions/files"


export default function Product(props) {
    const [quantity, setQuantity] = React.useState(1)
    const [formData, setFormData] = React.useState({
        title: props.prod?.title,
        description: props.prod?.description,
        photos: props.prod?.photos,
        price: Number(props.prod?.price.toFixed(2)),
        stock: props.prod?.stock
        //category_id: null
        //date_added: null
    })
    const [imgSrc, setImgSrc] = React.useState([])

    
    function getImgUrl(url) {
        if (isUrl(url)) {
            setImgSrc([url])
        } else {
            imageExists(`./img/products/${url}`)
                .then((ok) => {
                    if (ok) {
                        setImgSrc([`./img/products/${url}`])
                    } else {
                        setImgSrc([`./img/empty_img.png`])
                    }
                })
        }
    }
    
    React.useEffect(() => {
//check urls of images
        getImgUrl(props.prod.photos[0])

//scroll to top when product loads first time
        setTimeout(() => {
            window.scrollTo({top: 0, left: 0})
        }, 400)
        
    }, [])

    function handleQuantity(event) {
        const {value} = event.target

        value>props.prod.stock?setQuantity(props.prod.stock):setQuantity(Math.floor(value))
        value<1 && setQuantity(1)

    }
    function handleMinus() {
        setQuantity(oldVal =>
            oldVal<=1?oldVal:Number(oldVal)-1
        )
    }
    function handlePlus() {
       
        setQuantity(oldVal => 
            oldVal>=props.prod.stock?props.prod.stock:Number(oldVal)+1
        )
    }
    function handleChange(event) {
        setFormData(oldVal => {
            return(
                {...oldVal, [event.target.name]: event.target.value}
            )
        
        })
    }   
    
    return (
        <div className="product">
            <p className="product-close"><button className="btn" onClick={props.close}>Close X</button></p>
            {props.user && props.user.level<4?
            /* admin area */
                <div className="editor-txt">
                    <img
                            src={imgSrc[0]}
                            className="product-image" 
                            
                    />
                    
                    <form name="product_form" onSubmit={(event) => props.handleSaveProduct(event, formData)}>
                        <span>Title:</span>
                        <input className="input product-title" name="title" type="text" required onChange={handleChange} value={formData.title} />
                        <span>Description:</span>
                        <textarea className="input editor-content" name="description" onChange={handleChange} value={formData.description} />
                        <span>Price:</span>
                        <input className="input" name="price" type="number" onChange={handleChange} value={formData.price} />
                        <span>Stock:</span>
                        <input className="input" name="stock" type="number" onChange={handleChange} value={formData.stock} />
                        <div className="editor-txt-buttons">
                            <button type="submit" className="btn txt-green">Save</button> 
                            <button className="btn txt-red" onClick={(event) => props.handleDeleteProduct(event)}>Delete page</button>
                        </div>
                    </form>
                    {/* common view of product */}
                </div>:
                <>
                    <img
                            src={imgSrc[0]}
                            className="product-image" 
                    />
                    <p>{props.prod.title}</p>
                    <p>Price: <span>{Number(props.prod.price.toFixed(2))} €</span></p>
                    <p>Stock: <span>{props.prod.stock>0?props.prod.stock:"Out of stock!"}</span></p>

                    {props.prod.stock>0 && <p>
                        <span className="quantity-wrapper">
                            <span className="quantity-spinner" onClick={handleMinus}>-</span>
                            <input 
                                name="productQuantity"
                                className="product-quantity" 
                                type="number" 
                                min={1} 
                                max={props.prod.stock} 
                                value={quantity}
                                onChange={handleQuantity}
                                step={1}
                            />
                            <span className="quantity-spinner" onClick={handlePlus}>+</span>
                            <button className="btn" onClick={() => props.addToCart(props.prod.uid, quantity)}>Add to cart</button>
                        </span>
                        
                    </p>}
                    <p>{props.prod.description}</p>
                </>
            }
        </div>
    )
    
}