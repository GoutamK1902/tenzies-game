import React, { useEffect, useState } from "react";

export default function Header(props) {
  return (
    <div className="to-blur header">
      <div className="timer">
        <div>Time Left</div>
        <div>{props.timer}</div>
      </div>
      <div className="rolls-count">
        <div>Rolls</div>
        <div>{props.rollCount}</div>
      </div>
    </div>
  );
}
