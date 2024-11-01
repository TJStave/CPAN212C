import { useState } from "react";

const StatusBar = () => {
  const [score, setScore] = useState(0);
  return(
    <div style={{flex: 1, width: 200}}>
      Score: {score}<br/>
      <div style={{flex: 1, flexDirection: 'row'}}>
        <div style={{flex: 1, flexDirection: 'column'}}>
          Hands<br/>
          <input></input>
        </div>
      </div>
    </div>
  )
}

export default StatusBar;