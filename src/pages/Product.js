import React from "react"
import { isUrl, imageExists } from "../functions/files"
import { nanoid } from "nanoid"

export default function Product(props) {
    const [quantity, setQuantity] = React.useState(1)    
     
    const [formData, setFormData] = React.useState({
        title: props.prod?.title,
        description: props.prod?.description,
        photos: ["", "", "", "", "", ""],
        price: Number(props.prod?.price.toFixed(2)),
        stock: props.prod?.stock
        //category_id: null
        //date_added: null
    })

   // console.log(formData)
    
    const [imgSrc, setImgSrc] = React.useState([])
    const [reload, setReload] = React.useState(false)
    const [currentImg, setCurrentImg] = React.useState(1)

    const pager = 
        props.prod.photos.map((photo, index) => {
            
            return (
                <span key={nanoid()} className={currentImg===index+1?"product-image-page selected":"product-image-page"} onClick={() => handleChangePhoto(index+1)}></span>                        
            )
        })
    
    
    
//console.log(props.prod.photos)

    React.useEffect(() => {

        let photosArr = ["", "", "", "", "", ""]    
        for(let i =0;i<props.prod?.photos.length;i++) {
            photosArr[i] = props.prod.photos[i]
        }
        setFormData((oldData) => {

            return({...oldData, photos: photosArr})
            
        })
        //console.log("photosArr: ", photosArr )

//check urls of images
        getImgUrl()
//scroll to top when product loads first time
        setTimeout(() => {
            window.scrollTo({top: 0, left: 0})
        }, 400)
        
    }, [])


    //HOOK TO reload component when async imgurl check is done to display product image. This ug needs better solution
    React.useEffect(() => {
        setTimeout(() => {
            setCurrentImg(1)
            setReload(reload?false:true)
        }, 400)
    }, [imgSrc])
    
    function handleChangePhoto(num) {
        setCurrentImg(num)
        //setReload(reload?false:true)
        
    }

    function getImgUrl() {        
        if (props.prod.photos.length > 0) {
            let nArr3 = []
            for(let i=0;i<props.prod.photos.length;i++) {
                if (props.prod.photos[i] !== "") {
                    if (isUrl(props.prod.photos[i])) {
                        nArr3[i] = props.prod.photos[i]
                        //setImgSrc([url])
                    } else {
                        const af = async() => await imageExists(`./img/products/${props.prod.photos[i]}`)
                            
                        af().then((ok) => {
                            if (ok) {
                                nArr3[i] = `./img/products/${props.prod.photos[i]}`
                                //setImgSrc([`./img/products/${props.prod.photos[i]}`])
                            } else {
                                nArr3[i] = `./img/empty_img.png`
                                //setImgSrc([`./img/empty_img.png`])
                            }
                        })
                    }
                    setImgSrc(nArr3)
                }
            }
        
            
        } else {
            setImgSrc([`./img/empty_img.png`])
        }
        
    }
    

    

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
       // console.log(formData)

        const name = event.target.name
        setFormData((ov) => {
            if (name.startsWith("photo_")) {                
                let nArr2 = ["", "", "", "", "", ""] 
                nArr2 = [...ov.photos]
                nArr2[Number(name.charAt(6))-1] = event.target.value
                return(
                    {...ov, photos: nArr2}
                )

            } else {
            //const name = event.target.name.startsWith("photo_")?photos[Number(charAt(6))]:event.target.name
                return(
                    {...ov, [name]: event.target.value}
                )
            }
        
        })
    }   
    
    return (
        <div className="product">
            <p className="product-close"><button className="btn" onClick={props.close}>Close X</button></p>
            <span className="product-image-wrapper">
                <span className="product-image-pager">
                        {pager}
                </span>
                <img src={imgSrc[currentImg-1]} className="product-image" />                
            </span>
            {props.user && props.user.level<4?
            /* admin area */
                <div className="editor-txt">
                    
                    
                    <form name="product_form" onSubmit={(event) => props.handleSaveProduct(event, formData)}>
                        <span>Pictures urls:</span>
                        <input className="input editor-product-title" name="photo_1" type="text" onChange={handleChange} value={formData.photos[0]} />
                        <input className="input editor-product-title" name="photo_2" type="text" onChange={handleChange} value={formData.photos[1]} />
                        <input className="input editor-product-title" name="photo_3" type="text" onChange={handleChange} value={formData.photos[2]} />
                        <input className="input editor-product-title" name="photo_4" type="text" onChange={handleChange} value={formData.photos[3]} />
                        <input className="input editor-product-title" name="photo_5" type="text" onChange={handleChange} value={formData.photos[4]} />
                        <input className="input editor-product-title" name="photo_6" type="text" onChange={handleChange} value={formData.photos[5]} />

                        <span>Title:</span>
                        <input className="input editor-product-title" name="title" type="text" required onChange={handleChange} value={formData.title} />
                        <span>Description:</span>
                        <textarea className="input editor-content" name="description" onChange={handleChange} value={formData.description} />
                        <span>Price:</span>
                        <input className="input" name="price" type="number" onChange={handleChange} value={formData.price} />
                        <span>Stock:</span>
                        <input className="input" name="stock" type="number" onChange={handleChange} value={formData.stock} />
                        <div className="editor-txt-buttons">
                            <button type="submit" className="btn txt-green">Save</button> 
                            <button className="btn txt-red" onClick={(event) => props.handleDeleteProduct(event)}>Delete product</button>
                        </div>
                    </form>
                    {/* common view of product */}
                </div>:
                <>
                    
                    <p className="product-title">{props.prod.title}</p>
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