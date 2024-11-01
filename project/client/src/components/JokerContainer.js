import Joker from "./Joker";

const JokerContainer = () => {
  return(
    <div style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        <Joker/>
        <Joker/>
        <Joker/>
        <Joker/>
      </div>
    </div>
  )
}

export default JokerContainer;