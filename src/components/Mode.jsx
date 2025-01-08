import React from "react";

export default function Mode(props) {
  return (
    <section className="mode">
      <button
        onClick={() => {
          props.setMode("easy");
        }}
        className="easy"
      >
        Easy
      </button>
      <button
        onClick={() => {
          props.setMode("medium");
        }}
        className="medium"
      >
        Medium
      </button>
      <button
        onClick={() => {
          props.setMode("hard");
        }}
        className="hard"
      >
        Hard
      </button>
    </section>
  );
}
