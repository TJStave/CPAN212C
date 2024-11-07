import { useRef, useState } from "react";
import Joker from "./Joker";
import clamp from 'lodash/clamp';

const JokerContainer = ({rootRef, jokers}) => {
  const containerRef = useRef(null);
  const [sortTrigger, setSortTrigger] = useState(null);

  const moveJoker = (index, direction) => {
    //apparently this is an ES6 feature
    [jokers[index], jokers[clamp(index + direction, 0, jokers.length - 1)]] = [jokers[clamp(index + direction, 0, jokers.length - 1)], jokers[index]];
    setSortTrigger({...sortTrigger});
  }

  return(
    <div ref={containerRef} style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        {
          jokers.map((jokerData, jokerIndex) => (
            <Joker key={jokerData.key} index={jokerIndex} data={jokerData} move={moveJoker} rootRef={rootRef} scrollRef={containerRef}/>
          ))
        }
      </div>
    </div>
  )
}

export default JokerContainer;