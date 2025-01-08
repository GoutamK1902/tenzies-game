import { useState, useRef, useEffect } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import Header from "./components/Header";

export default function App() {
  const { width, height } = useWindowSize();
  const [dice, setDice] = useState(generateAllNewDice());
  const [rollCount, setRollCount] = useState(0);
  const [timer, setTimer] = useState(60);

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  // newGame in focus -using useEffect because DOM is not controlled by react
  const buttonRef = useRef(null);
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prevCount) => {
        if (prevCount <= 1 || gameWon) {
          clearInterval(timerId); // Stop the interval when timer reaches 0
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000); // 1000 ms = 1 second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [timer]);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  useEffect(() => {
    if (!gameWon && timer == 0) {
      document.body.classList.add("lose");
      // Cleanup function to remove the class when the component unmounts
    }
    return () => {
      document.body.classList.remove("lose");
    };
  }, [gameWon, timer]);

  function rollDice() {
    if (gameWon) {
      setDice((oldDice) =>
        oldDice.map(() => ({
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid(),
        }))
      );
      setRollCount(0);
      setTimer(60);
    } else if (!gameWon && timer == 0) {
      setDice((oldDice) =>
        oldDice.map(() => ({
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid(),
        }))
      );
      setRollCount(0);
      setTimer(60);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
      setRollCount((prev) => prev + 1);
    }
  }
  console.log(buttonRef);

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ));

  return (
    <>
      <Header timer={timer} setTimer={setTimer} rollCount={rollCount} />
      <main>
        {gameWon && <Confetti width={width - 20} height={height} />}
        <h1 className="title">Tenzies</h1>
        {!gameWon ? (
          <>
            <p className="to-blur instructions">
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
            <div className="dice-container">{diceElements}</div>
          </>
        ) : (
          <div className="won">You Won</div>
        )}
        <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
          {gameWon || timer == 0 ? "New Game" : "Roll"}
        </button>
      </main>
    </>
  );
}
