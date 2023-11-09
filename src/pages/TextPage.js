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
        "title": nArr[0]?.title,
        "content": nArr[0]?.content,
        "order": nArr[0]?.order,
        "type_id": nArr[0]?.type_id
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
 
    function handleSubmit(event) {
        event.preventDefault()
        const pageExist = async() => {
            const pagesArr =  await dbQuery("sws-pages", db, false, ["__name__", "==", props.id])
           // console.log(pagesArr)
            //check if it's a new page or editing old one
            if (pagesArr.length > 0) {
                if ((formData.title !=="") && (formData.content!=="")) {
                    const updateDb = async() => {
                        const pageRef = doc(db, "sws-pages", props.id)
                        await updateDoc(pageRef, { 
                            title: formData.title, 
                            content: formData.content, 
                            order: formData.order 
                        })
                    }

                    //need to trigger pagesRaw state update after save

                    updateDb().then((err) => err?alert("Content NOT changed. Error: " + err):alert("Content successfully changed!"))
                    .then(props.triggerReloadPages())
                }
                //new page
            } else {
                
                const newPageArr = props.pages[props.pages.length-1]
                delete newPageArr.uid

                console.log("new Page", newPageArr)

                const addPage = async() => await addDoc(collection(db, "sws-pages"), newPageArr)
                addPage().then((err) => err?alert("Page NOT created. Error: " + JSON.stringify(err)):alert("New page created!"))
                .then(props.triggerReloadPages())
            }

        }
        pageExist()

        /*  */
    }

    function handleDeletePage(event) {
        event.preventDefault()
        if (window.confirm("Are you sure to delete this page and all sub-pages?")) {
            const pageRef = doc(db, "sws-pages", props.id)            
            const q = query(collection(db, "sws-pages"), where("parent_id", "==", props.id))
            try {
                const getChilds = async() => {
                    const childs = await getDocs(q)
                    if (childs.docs.length>0) {                        
                        childs.forEach((d) => {
                            const childsRef = doc(db, "sws-pages", d.id)
                            const dd = async() => {
                                await deleteDoc(childsRef)
                            }
                            dd()                            
                        })
                    }
                }
                getChilds()
                const delPage = async() => {
                    await deleteDoc(pageRef)
                }
                delPage().then((err) => err?
                    alert("Could not delete page. Error: " + err):alert("Page successfully deleted!"))
                    .then(props.triggerReloadPages())
                    

            } catch (err) {                
                    console.log("ERROR!: " + err)
                    return false
            }

        }
        //check if has children
    }

    return (
        props.user && props.user.level <4 ?
        <div className="editor-txt">
            <form name="txt_page_form" onSubmit={(event) => handleSubmit(event)}>
                <span>Page title:</span>
                <input className="input" name="title" type="text" required onChange={handleChange} value={formData.title} />
                <span>Page content:</span>
                <textarea className="input editor-content" name="content" required onChange={handleChange} value={formData.content} />
                <span>Order:</span>
                <input className="input" name="order" type="number" min={1} max={1000} onChange={handleChange} value={formData.order} />
                <span>Page type:</span>
                <select name="type_id" className="input" value={formData.type_id} onChange={handleChange}>
                    <option value={200}>Catalog</option>
                    <option value={100}>Text page</option>
                    
                </select>
                <div className="editor-txt-buttons">
                    <button type="submit" className="btn">Save</button> 
                    <button className="btn txt-red" onClick={handleDeletePage}>Delete page</button>
                </div>
            </form>
        </div>
        :
        <div>
            {nArr && nArr[0].content}
        </div>
    )
}