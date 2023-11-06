import React from "react"
import dbQuery from "../functions/dbQuery"
import { db } from "../firebase"

export default function UserInfo(props) {

    const [orders, setOrders] = React.useState()
    
    //orders hook
    React.useEffect(() => {
        const qOrders = async () => {
            const uData = await dbQuery("sws-orders", db, false, ["user_id", "==", props.user.id])                
            if (uData.length>0) {
                //console.log(uData)
                const nArr = uData.map(order => ({
                    ...order.data(),
                    uid: order.id
                }))
                setOrders(nArr)
                //console.log("there is some orders")     
            }           
        }
        qOrders()
    }, [])

    
    
    let last_seen, reg, ordersComp

    if(props.user.reg_date) {
        reg = props.user.reg_date.toDate().toLocaleDateString()+ "  " +props.user.reg_date.toDate().toLocaleTimeString()
    }
    if(props.user.last_seen) {
        last_seen = props.user.last_seen.toDate().toLocaleDateString()+ "  " +props.user.last_seen.toDate().toLocaleTimeString()
    }

    if(orders) {
       // console.log(props.orders)

        ordersComp = orders.map(function(o) {
        const prod =  props.prod.filter(page => page.uid === o.item_id)
//console.log(allProducts)

        return (            
            <tr key={o.uid}>
                <td><span>{o.date?.toDate().toLocaleDateString()+ "  " +o.date?.toDate().toLocaleTimeString()}</span></td>
                <td><span>{prod[0]?.title}</span></td>
                <td><span>{o?.quantity}</span></td>
                <td><span>{o?.price}</span></td>
            </tr>
        )})
        //orders = props.orders[0].date.toDate().toLocaleDateString()
    } else {
        ordersComp = "No orders yet!"
    }
    //console.log(orders)   

    return (
        <div className="userinfo">            
            <p><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p>Name: <span>{props.user.name}</span></p>
            <p>Registered: <span>{reg}</span></p>
            <p>Last login: <span>{last_seen}</span></p>
            <p>Theme: <span>{props.user.color_theme}</span></p>
            <p>Order history:</p>
            {Array.isArray(orders)? 
                
                <table className="orders_table">
                    <thead>
                        <tr>
                            <td><span>Date</span></td>
                            <td><span>Product</span></td>
                            <td><span>Quantity</span></td>
                            <td><span>Price per item</span></td>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersComp}
                    </tbody>
                </table>
                
            : ordersComp
            }
            {/* {Array.isArray(orders) && <p><button className="btn">Clear order data</button></p>} */}
        </div>
    )
    
}