import { 
    collection,
    onSnapshot, 
    addDoc, //adds collection to db
    doc, //reference to specific item
    deleteDoc, //delete db item
    setDoc, //updates db item
    query, //db query
    where, //where statement for query
    getDocs, //returns docs with given query
    FieldPath
  } from "firebase/firestore"
import { db } from "../firebase"
//where syntax: ['field', 'operator', 'value']
//all === true means return all documents from given collection. If it's true, where is ignored
//returns all docs object which can be spread by map() function and each maped value accessed by .data().fieldName
async function dbQuery(catalog, db, all=false, where) {    
    const field=where && where[0], operator=where && where[1], value=where && where[2]



    const q = all?    
        query(collection(db, catalog))
        :query(collection(db, catalog), where(field, operator, value))
    try {
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs
    } catch (err) {                
        console.log("ERROR!: " + err)
        return false
    }
}

export default dbQuery