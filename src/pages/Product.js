import React from "react"
export default function Product(props) {
    const [quantity, setQuantity] = React.useState(1)
    let imageSrc
    try {
        imageSrc = require(`../img/products/fruits/${props.prod.photos[0]}`)
    } catch(err) {            
        imageSrc = require(`../img/empty_img.png`)
    }

    //scroll to top when product loads
    React.useEffect(() => {
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
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' })
        setQuantity(oldVal => 
            oldVal>=props.prod.stock?props.prod.stock:Number(oldVal)+1
        )
    }
    return (
        <div className="product">
            <p className="product-close"><button className="btn" onClick={props.close}>Close X</button></p>
            <img
                    src={imageSrc}
                    className="product-image" 
            />
            <p>{props.prod.title}</p>
            <p>Price: <span>{props.prod.price} €</span></p>
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
            
        </div>
    )
    
}