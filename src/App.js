import React from "react"
import Intro from "./components/Intro"
import Content from "./components/Content"
import { 
  collection,
  onSnapshot, 
  addDoc, //adds collection to db
  doc, //reference to specific item
  deleteDoc, //delete db item
  setDoc, //updates db item
  query, //db query
  where, //where statement for query
  getDocs //returns docs with given query
} from "firebase/firestore"
import { db } from "./firebase"


function App() {
  const [intro, setIntro] = React.useState("true")
  


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
