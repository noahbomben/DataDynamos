import React from "react";
import WhiteBoard from "../WhiteBoard/WhiteBoard";
import "./Container.css";

function Container() {
  return (

    
    <div className="container">
        <div className="color-picker-container">
            <input type="color" />
        </div>
      <WhiteBoard />
    </div>
  );
}

export default Container;
