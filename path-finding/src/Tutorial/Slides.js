import React from "react";

function Slides({ description, imgSrc }) {
  return (
    <div className="slide">
      <img src={imgSrc} alt="Slide" />
      <h4>{description}</h4>
    </div>
  );
}

export default Slides;
