export default function ContentCart(props) {
    function viewCart() {
        const storage = JSON.parse(localStorage.getItem("cart"));
        console.log(storage)
    }
    function clearStorage() {
        localStorage.clear()
        props.updateCart(null)
    }
    return (
        <div className="content-cart">
            <p>Items in you cart: <span className="content-cart-numberofitems">{props.cartDetails.cartItems}</span></p>
            <p>Total: <span className="content-cart-total">{props.cartDetails.cartTotal}€</span></p>
            <div className="content-cart-footer">
                <span className="content-cart-char" onDoubleClick={clearStorage}>🛒</span>
                <button className="btn" onClick={viewCart}>view cart</button>
            </div>
        </div>
    )
}