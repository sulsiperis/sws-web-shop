import React from "react"
import dbQuery from "../functions/dbQuery"
import { 
    collection,
    addDoc, //adds collection to db
    doc, //reference to specific item
    updateDoc,
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
  } from "firebase/firestore"
import { db } from "../firebase"

export default function TextPage(props) {
    const nArr = props.pages.filter(page => (page.uid === props.id))
    const [formData, setFormData] = React.useState({
        "title": nArr[0].title,
        "content": nArr[0].content,
        "order": nArr[0].order
    })

    React.useEffect(() => {
        setFormData({
            "title": nArr[0].title,
            "content": nArr[0].content,
            "order": nArr[0].order
        })
    }, [props.id])

    function handleChange(event) {
        setFormData(oldVal => {
            return(
                {...oldVal, [event.target.name]: event.target.value}
            )
        
        })
    }
    function handleSubmit(event) {
        event.preventDefault()
        if ((formData.title !=="") && (formData.content!=="")) {
            const updateDb = async() => {
                const pageRef = doc(db, "sws-pages", props.id)
                await updateDoc(pageRef, { 
                    title: formData.title, 
                    content: formData.content, 
                    order: formData.order 
                })
            }
            updateDb().then((err) => err?alert("Content NOT changed. Error: " + err):alert("Content successfully changed!"))
        }
    }
    return (
        props.user && props.user.level <4 ?
        <div className="editor-txt">
            <form name="txt_page_form" onSubmit={handleSubmit}>
                <span>Page title:</span>
                <input className="input" name="title" type="text" required onChange={handleChange} value={formData.title} />
                <span>Page content:</span>
                <textarea className="input editor-content" name="content" required onChange={handleChange} value={formData.content} />
                <span>Order:</span>
                <input className="input" name="order" type="number" min={1} max={1000} onChange={handleChange} value={formData.order} />
                <button type="submit" className="btn">Save</button>
            </form>
        </div>
        :
        <div>
            {nArr && nArr[0].content}
        </div>
    )
}