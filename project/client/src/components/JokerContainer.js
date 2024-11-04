import { useRef } from "react";
import Joker from "./Joker";

const JokerContainer = ({rootRef, jokers}) => {
  const containerRef = useRef(null);

  return(
    <div ref={containerRef} style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        {
          jokers.map((jokerData) => (
            <Joker key={jokerData.key} data={jokerData} rootRef={rootRef} scrollRef={containerRef}/>
          ))
        }
      </div>
    </div>
  )
}

export default JokerContainer;