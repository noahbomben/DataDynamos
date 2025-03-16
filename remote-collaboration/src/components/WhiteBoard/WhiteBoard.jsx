import React, { useState, useEffect, useRef } from "react";
import "./WhiteBoard.css";

const WhiteBoard = (props) => {
  const [color, setColor] = useState("black");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sketch = document.querySelector("#sketch");
    const sketch_style = getComputedStyle(sketch);

    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));


  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const mouse = { x: 0, y: 0 };
    const last_mouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {    

      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.pageX - canvas.offsetLeft;
      mouse.y = e.pageY - canvas.offsetTop;
    };

    const handleMouseDown = () => {
      canvas.addEventListener("mousemove", onPaint, false);
    };

    const handleMouseUp = () => {
      canvas.removeEventListener("mousemove", onPaint, false);
    };

    const onPaint = () => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
    };

    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove, false);
      canvas.removeEventListener("mousedown", handleMouseDown, false);
      canvas.removeEventListener("mouseup", handleMouseUp, false);
    };
  }, [color, props]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <div className="sketch" id="sketch">
      <input type="color" value={color} onChange={handleColorChange} />
      <canvas className="board" id="board" ref={canvasRef}></canvas>
    </div>
  );
};

export default WhiteBoard;
