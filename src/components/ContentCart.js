export default function ContentCart() {
    return (
        <div className="content-cart">
            <p>Items in you cart: <span className="content-cart-numberofitems">3</span></p>
            <p>Total: <span className="content-cart-total">199.46€</span></p>
            <div className="content-cart-footer">
                <span className="content-cart-char">🛒</span>
                <button className="content-cart-view">view cart</button>
            </div>
        </div>
    )
}