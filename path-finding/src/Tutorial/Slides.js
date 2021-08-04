import React from "react";

function Slides({ description, imgSrc, extraMsg = "" }) {
  return (
    <div className="slide">
      <img src={imgSrc} alt="Slide" />
      <h4>{description}</h4>
      {extraMsg !== "" ? <p>{extraMsg}</p> : <></>}
    </div>
  );
}

export default Slides;
