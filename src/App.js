import { useEffect, useState } from "react";
import { Scoreboard } from "./components/scoreboard";
import blueCandy from "./images/blue-candy.png"
import greenCandy from "./images/green-candy.png"
import orangeCandy from "./images/orange-candy.png"
import purpleCandy from "./images/purple-candy.png"
import redCandy from "./images/red-candy.png"
import yellowCandy from "./images/yellow-candy.png"
import blank from "./images/blank.png"

const width = 8;
const candyColors = [
  blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy
]

const App = () => {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState();
  const [candyBeingMoved, setCandyBeingMoved] = useState();
  const [candyBeingReplaced, setCandyBeingReplaced] = useState();
  const [score, setScore] = useState(0);

  const createBoard = () => {
    const randomCandyArrangement = [];
    for (let i = 0; i < width * width; i++){
      const randomNumber = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber];
      randomCandyArrangement.push(randomColor);
    }
    setCurrentCandyArrangement(randomCandyArrangement)
  }

  const checkColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const matchColor = currentCandyArrangement[i];
      const isBlank = currentCandyArrangement[i] === blank;

      if ( columnOfFour.every(candy => currentCandyArrangement[candy] === matchColor && !isBlank)) {
        setScore((score) => score + 40)
        columnOfFour.forEach(candy => currentCandyArrangement[candy] = blank)
        return true;
      }
    }
  }

  const checkColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const matchColor = currentCandyArrangement[i];
      const isBlank = currentCandyArrangement[i] === blank;

      if ( columnOfThree.every(candy => currentCandyArrangement[candy] === matchColor && !isBlank)) {
        setScore((score) => score + 30)
        columnOfThree.forEach(candy => currentCandyArrangement[candy] = blank)
        return true;
      }
    }
  }

  const checkRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const matchColor = currentCandyArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      const isBlank = currentCandyArrangement[i] === blank;

      if (notValid.includes(i)) continue

      if ( rowOfFour.every(candy => currentCandyArrangement[candy] === matchColor && !isBlank)) {
        setScore((score) => score + 40)
        rowOfFour.forEach(candy => currentCandyArrangement[candy] = blank)
        return true;
      }
    }
  }

  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const matchColor = currentCandyArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentCandyArrangement[i] === blank;

      if (notValid.includes(i)) continue

      if ( rowOfThree.every(candy => currentCandyArrangement[candy] === matchColor && !isBlank)) {
        setScore((score) => score + 30)
        rowOfThree.forEach(candy => currentCandyArrangement[candy] = blank)
        return true;
      }
    }
  }

  const moveBelow = () => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentCandyArrangement[i] === blank) {
        let randomCandy = Math.floor(Math.random() * candyColors.length);
        currentCandyArrangement[i] = candyColors[randomCandy]
      }
      if (currentCandyArrangement[i + width] === blank) {
        currentCandyArrangement[i + width] = currentCandyArrangement[i]
        currentCandyArrangement[i] = blank
      }
    }
  }

  const dragStart = (e) => {
    setCandyBeingMoved(e.target);
  }

  const dragDrop = (e) => {
    setCandyBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    const draggedCandyId = parseInt(candyBeingMoved.getAttribute("data-id"));
    const replacedCandyId = parseInt(candyBeingReplaced.getAttribute("data-id"));

    currentCandyArrangement[replacedCandyId] = candyBeingMoved.getAttribute("src")
    currentCandyArrangement[draggedCandyId] = candyBeingReplaced.getAttribute("src")

    console.log("draggedCandyId:", draggedCandyId);
    console.log("replacedCandyId:", replacedCandyId);

    const validMoves = [
      draggedCandyId - 1,
      draggedCandyId - width,
      draggedCandyId + 1,
      draggedCandyId + width
    ]

    const validMove = validMoves.includes(replacedCandyId)
    
    const isAColumnOfFour = checkColumnOfFour();
    const isARowOfFour = checkRowOfFour();
    const isAColumnOfThree = checkColumnOfThree();
    const isARowOfThree = checkRowOfThree();

    if (replacedCandyId && validMove && ( isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour)) {
      setCandyBeingMoved(null)
      setCandyBeingReplaced(null)
    } else {
      currentCandyArrangement[replacedCandyId] = candyBeingReplaced.getAttribute("src")
      currentCandyArrangement[draggedCandyId] = candyBeingMoved.getAttribute("src")
      setCurrentCandyArrangement([...currentCandyArrangement])
    }
  }

  useEffect(() => {
    createBoard();
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnOfFour()
      checkRowOfFour()
      checkColumnOfThree()
      checkRowOfThree()
      moveBelow()
      setCurrentCandyArrangement([...currentCandyArrangement])
    }, 200)
    return () => clearInterval(timer)
  }, [checkColumnOfFour, checkRowOfFour, checkColumnOfThree, checkRowOfThree, moveBelow, currentCandyArrangement])
  
  return (
    <div className="app">
      <div className="game">
        {currentCandyArrangement?.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />)
        )}
      </div>
      <Scoreboard score={score} />
    </div>
  );
}

export default App;
