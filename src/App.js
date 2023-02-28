import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const width = 8;
  const candyListColor = ["red", "orange", "purple", "green", "blue", "yellow"];
  const [candyList, setCandyList] = useState([]);
  const [candyDrag, setCandyDrag] = useState(null);
  const [candyDrop, setCandyDrop] = useState(null);
  const candylistvar = [];
  
  // CREATE BOARD OF THE GAME

  const createGameBoard = () => {
    console.log("candylistvar");
    for (let i = 0; i < width * width; i++) {
      candylistvar.push(
        candyListColor[Math.floor(Math.random() * candyListColor.length)]
      );
    }
    setCandyList(candylistvar);
  };

  // DRAG AND SWITCH
  
  const dragStart = (e)=>{
    setCandyDrag(e.target)
  }

  const dragDrop = (e)=>{
    setCandyDrop(e.target)
  } 

  const dragEnd = (e)=>{
    const candyDragedId = parseInt(candyDrag.getAttribute('data-id'))
    const candyDropId = parseInt(candyDrop.getAttribute('data-id'))


    const validMoves = [
      candyDragedId - 1 , 
      candyDragedId + 1 , 
      candyDragedId + width,
      candyDragedId - width,
    ]
    const isvalid = validMoves.includes(candyDropId)
    console.log("lllllllllllll", isvalid, candyDrag.getAttribute('data-id'), validMoves);
    if (candyDropId && isvalid ) {
      candyList[candyDragedId] = candyDrop.style.backgroundColor
      candyList[candyDropId] = candyDrag.style.backgroundColor
      const first = checkForFourColumn();
      const second = checkForFourRow();
      const third = checkForThreeColumn();
      const fourth = checkForThreeRow();
      if ((first || second || third || fourth)) {
        setCandyDrag(null)
        setCandyDrop(null)
      }
    }
    else{
      setCandyList([...candyList]);
    }
  }
  //MOVE INTO SQUARE BELOW

  const moveIntoSquareDown = () => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && candyList[i] == "") {
        const randomnumber = Math.floor(Math.random() * candyListColor.length);
        candyList[i] = candyListColor[randomnumber];
      }
      if (candyList[i + width] == "") {
        candyList[i + width] = candyList[i];
        candyList[i] = "";
      }
    }
  };

  // COLOUMN

  //check For THREE COLUMN
  const checkForThreeColumn = () => {
    for (let i = 0; i < 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidecolor = candyList[i];
      if (columnOfThree.every((squre) => decidecolor === candyList[squre])) {
        columnOfThree.forEach((squre) => (candyList[squre] = ""));
        return true
      }
    }
  };
  //check For FOUR COLUMN

  const checkForFourColumn = () => {
    for (let i = 0; i < 46; i++) {
      const columnOfThree = [i, i + width, i + width * 2, i + width * 3];
      const decidecolor = candyList[i];
      if (columnOfThree.every((squre) => candyList[squre] === decidecolor)) {
        columnOfThree.forEach((squre) => (candyList[squre] = ""));
        return true
      }
    }
  };

  // ROW

  //CHECK FOR THREE ROW
  const checkForThreeRow = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidecolor = candyList[i];
      const notvalid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      if (notvalid.includes(i)) continue;
      if (rowOfThree.every((squre) => decidecolor === candyList[squre])) {
        rowOfThree.forEach((squre) => (candyList[squre] = ""));
        return true
      }
    }
  };
  //CHECK FOR FOUR ROW

  const checkForFourRow = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2, i + 3];
      const decidecolor = candyList[i];
      const notvalid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      if (notvalid.includes(i)) continue;
      if (rowOfThree.every((squre) => decidecolor === candyList[squre])) {
        rowOfThree.forEach((squre) => (candyList[squre] = ""));
        return true
      }
    }
  };

  useEffect(() => {
    console.log("candylistvar");
    createGameBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForFourColumn();
      checkForFourRow();
      checkForThreeColumn();
      checkForThreeRow();
      moveIntoSquareDown();
      setCandyList([...candyList]);
    }, 100);
    return () => clearInterval(timer);
  }, [checkForThreeColumn, checkForFourColumn, candyList]);
  return (
    <div className="App">
      <div className="game">
        {candyList.map((candy, index) => {
          return (
            <img
              alt="canndy color"
              data-id = {index}
              draggable = {true}
              onDragStart = {dragStart}
              onDragOver = {(e) => e.preventDefault()}
              onDragEnter = {(e) => e.preventDefault()}
              onDragLeave = {(e) => e.preventDefault()}
              onDrop = {dragDrop}
              onDragEnd = {dragEnd}
              key={index}
              style={{ backgroundColor: candy }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
