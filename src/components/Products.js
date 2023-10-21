export default function Products(props) {
    const prods = props.items.map(prod => {
       
        let imageSrc
        try {
            imageSrc = require(`../img/products/fruits/${prod.photos[0]}`)
        } catch(err) {            
            imageSrc = require(`../img/empty_img.png`)
        }
        return ( 
            <div className="product" key={prod.uid}>
                <img 
                    src={imageSrc}
                    className="product-thumb" 
                />
                {/* <ImageGallery items={images} showThumbnails={false} /> */}
                <span className="product-title">{prod.title}</span>
                <span className="product-price">{prod.price}€</span>
                <span className="product-stock">{prod.stock}</span>
                <button className="btn">Add to cart</button>
            </div>
        )
    })
    return (
        <div className="products">
            {prods}           
        </div>
    )
}