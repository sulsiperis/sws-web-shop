export default function Product(props) {
    let imageSrc
    try {
        imageSrc = require(`../img/products/fruits/${props.prod.photos[0]}`)
    } catch(err) {            
        imageSrc = require(`../img/empty_img.png`)
    }
    return (
        <div className="product">
            <p className="product-close"><button className="btn" onClick={props.close}>Close X</button></p>
            <img
                    src={imageSrc}
                    className="product-image" 
            />
            <p>{props.prod.title}</p>
            <p>Price: <span>{props.prod.price}</span></p>
            <p>Stock: <span>{props.prod.stock}</span></p>
            <p>
                <input className="product-quantity" type="number" min={1} max={props.prod.stock} defaultValue={1} />
                <button className="btn" onClick={() => props.addToCart(props.prod.uid)}>Add to cart</button>
            </p>
            <p>{props.prod.description}</p>
        </div>
    )
    
}