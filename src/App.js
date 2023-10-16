import React from "react"
import Intro from "./components/Intro"
import Content from "./components/Content"

function App() {
  const [intro, setIntro] = React.useState("true")

  function switchIntro() {
      setIntro(oldval => {
        return !oldval
      })
  }
  return (
    <main>
      { intro?<Intro 
                showIntro={intro} 
                changeIntro={switchIntro} 
              />:<Content 
                    changeIntro={switchIntro} 
              /> }      
    </main>
  );
}

export default App;
