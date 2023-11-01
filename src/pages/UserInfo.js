import React from "react"
import dbQuery from "../functions/dbQuery"
import { db } from "../firebase"

export default function UserInfo(props) {

    const [orders, setOrders] = React.useState()

    let last_seen, reg, ordersComp
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

    if(props.user.reg_date) {
        reg = props.user.reg_date.toDate().toLocaleDateString()+ "  " +props.user.reg_date.toDate().toLocaleTimeString()
    }
    if(props.user.last_seen) {
        last_seen = props.user.last_seen.toDate().toLocaleDateString()+ "  " +props.user.last_seen.toDate().toLocaleTimeString()
    }

    if(orders) {
       // console.log(props.orders)

        ordersComp = orders.map(o => (
            <div key={o.uid}>
                <span>{o.date.toDate().toLocaleDateString()+ "  " +o.date.toDate().toLocaleTimeString()}</span>
                <span>{o.item_id}</span>
                <span>{o.quantity}</span>
                <span>{o.price}</span>
            </div>
        ))
        //orders = props.orders[0].date.toDate().toLocaleDateString()
    } else {
        ordersComp = "No orders yet!"
    }
    //console.log(orders)
    

    
    console.log(orders)

     /* const q = async () => {
        const uData = await props.orders(props.user.id)
        if (uData.length>0) {
            console.log(uData)
            const nArr = uData && uData.map(order => ({
                ...order.data(),
                uid: order.id
            }))
            setOrders(nArr)
            console.log("there is some orders")     
        } else {
            
            setOrders("No orders yet.")
            
        }            
    }
    q() */

    //console.log(orders)
    
    return (
        <div className="userinfo">            
            <p><button className="btn" onClick={props.handleLogout}>Logout</button></p>
            <p>Name: <span>{props.user.name}</span></p>
            <p>Registered: <span>{reg}</span></p>
            <p>Last login: <span>{last_seen}</span></p>
            <p>Theme: <span>{props.user.color_theme}</span></p>
            <p>Order history:</p>
            {ordersComp}
          
        </div>
    )
    
}