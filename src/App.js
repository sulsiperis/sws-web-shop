import React from "react"
import Intro from "./components/Intro"
import Content from "./components/Content"
import { 
  collection,
  onSnapshot, 
  addDoc, //adds collection to db
  doc, //reference to specific item
  deleteDoc, //delete db item
  setDoc //updates db item
} from "firebase/firestore"
import { db } from "./firebase"



function App() {
  const [intro, setIntro] = React.useState("true")
  const [categories, setCategories] = React.useState([])

  React.useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "sws-categories"), function(snapshot) {         
          const nArr = snapshot.docs.map(doc => ({
              ...doc.data(),
              uid: doc.id
          }))
          setCategories(nArr)            
      })       
      return unsubscribe
  }, [])

  console.log(categories)

  function switchIntro() {
      setIntro(oldval => {
        return !oldval
      })
  }
  return (
    <main>
      { 
        intro?<Intro 
                showIntro={intro} 
                changeIntro={switchIntro} 
              />:<Content 
                    changeIntro={switchIntro} 
              /> 
      }      
    </main>
  );
}

export default App;
