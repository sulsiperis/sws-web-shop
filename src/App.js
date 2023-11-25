import React from "react"
import Intro from "./components/Intro"
import Content from "./components/Content"
import { db } from "./firebase"
import dbQuery from "./functions/dbQuery"

function App() {
  const [intro, setIntro] = React.useState("true")
  const [initialPagesRaw, setInitialPagesRaw] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
        const cdata = await dbQuery("sws-pages", db, true)        
            if(!cdata) {
                alert('Error connecting to db!')
            } else {
                const nArr = cdata.map(pg => ({
                    ...pg.data(),
                    uid: pg.id
                }))
                setInitialPagesRaw(nArr)                
            }
    }
    fetchData()    
}, [])

  function switchIntro() {
      
      setIntro(oldval => {
        return !oldval
      })
  }
  return (
    <>
      
      { 
        intro?<Intro 
                showIntro={intro} 
                changeIntro={switchIntro} 
              />:<Content
                    initialPagesRaw={initialPagesRaw}
                    changeIntro={switchIntro}
                    setInitialPagesRaw={() => setInitialPagesRaw([])}
                    
              /> 
      }      
    </>
  );
}

export default App;
