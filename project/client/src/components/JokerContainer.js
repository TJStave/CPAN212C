import Joker from "./Joker";

const JokerContainer = () => {
  const testJokers = [
    {'joker': 'halfJoker', 'lifespan': 'perishable'},
    {'joker': 'steelJoker', 'lifespan': 'eternal'},
    {'joker': 'weeJoker', 'lifespan': 'eternal', 'debuff': 'rental'},
    {'joker': 'photograph', 'debuff': 'rental'},
    {'joker': 'squareJoker'},
    {}
  ]

  return(
    <div style={{flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto'}}>
      <div style={{display: 'inline-flex'}}>
        {
          testJokers.map((jokerData) => (
            <Joker key={crypto.randomUUID()} data={jokerData}/>
          ))
        }
      </div>
    </div>
  )
}

export default JokerContainer;