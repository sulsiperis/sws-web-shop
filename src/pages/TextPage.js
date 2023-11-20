import React from "react"
import Editor from 'react-simple-wysiwyg';
import { getJsxFromStr } from "../functions/files";

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
        "title": "",
        "content": "",
        "order": 0,
        "type_id": 0
    })

    React.useEffect(() => {
        setFormData({
            "title": nArr[0]?.title,
            "content": nArr[0]?.content,
            "order": nArr[0]?.order,
            "type_id": nArr[0]?.type_id
        })
    }, [props.id])

    function handleChange(event) {
        setFormData(oldVal => {
            return(
                {...oldVal, [event.target.name]: event.target.value}
            )
        
        })
    }
       
    return (
        props.user && props.user.level <4 ?
        <div className="editor-txt">
            <form name="txt_page_form" onSubmit={(event) => props.handleSubmit(event, formData)}>
                <span>Page title:</span>
                <input className="input" name="title" type="text" required onChange={handleChange} value={formData.title} />
                <span>Page content:</span>

                <Editor name="content" value={formData.content} onChange={handleChange} />

                {/* <textarea className="input editor-content" name="content" required onChange={handleChange} value={formData.content} /> */}


                <span>Order:</span>
                <input className="input" name="order" type="number" min={1} max={1000} onChange={handleChange} value={formData.order} />
                <span>Page type:</span>
                <select name="type_id" className="input" value={formData.type_id} onChange={handleChange}>
                    <option value={200}>Catalog</option>
                    <option value={100}>Text page</option>
                    
                </select>
                <div className="editor-txt-buttons">
                    <button type="submit" className="btn txt-green">Save</button> 
                    <button className="btn txt-red" onClick={(event) => props.handleDeletePage(event)}>Delete page</button>
                </div>
            </form>
        </div>
        :
        <div>            
            {nArr && getJsxFromStr(nArr[0]?.content)}
        </div>
    )
}