import { useEffect, useState } from "react";

const width = 8;
const candyColors = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow"
]

const App = () => {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState();

  const createBoard = () => {
    const randomCandyArrangement = [];
    for (let i = 0; i < width * width; i++){
      const randomNumber = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber];
      randomCandyArrangement.push(randomColor);
    }
    setCurrentCandyArrangement(randomCandyArrangement)
  }

  const checkColumnOfThree = () => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const matchColor = currentCandyArrangement[i];

      if ( columnOfThree.every(candy => currentCandyArrangement[candy] === matchColor)) {
        columnOfThree.forEach(candy => currentCandyArrangement[candy] = "")
      }
    }
  }

  useEffect(() => {
    createBoard();s
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnOfThree()
      setCurrentCandyArrangement([...currentCandyArrangement])
    }, 100)
    return () => clearInterval(timer)
  }, [checkColumnOfThree])

  console.log(currentCandyArrangement)
  
  return (
    <div className="app">
      <div className="game">
        {currentCandyArrangement?.map((candyColor, index) => (
          <img
            key={index}
            style={{backgroundColor: candyColor}}
            alt={candyColor}
          />)
        )}
      </div>
    </div>
  );
}

export default App;
