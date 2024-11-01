import { useState, useEffect } from 'react';

const Joker = ({data}) => {
  if(!Object.hasOwn(data, 'joker')){
    data.joker = 'jimbo';
  }

  const [jokerImg, setJokerImg] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchJoker = async () => {
      const response = await fetch('http://localhost:8000/build/joker', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const imgURL = await response.text();
      setJokerImg(imgURL);
    }
    fetchJoker();
  }, []);

  return(
    <img src={jokerImg} alt="" style={{alignSelf: 'center'}}/>
  );
}

export default Joker;