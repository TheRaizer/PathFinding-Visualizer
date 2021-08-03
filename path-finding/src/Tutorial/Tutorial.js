import React, { useState, useRef } from "react";
import Slides from "./Slides.js";
import firstSlideSrc from "./Images/TutorialSlide1.gif";
import secondSlideSrc from "./Images/TutorialSlide2.gif";
import thirdSlideSrc from "./Images/TutorialSlide3.gif";
import fourthSlideSrc from "./Images/TutorialSlide4.png";
import fifthSlideSrc from "./Images/TutorialSlide5.png";
import sixthSlideSrc from "./Images/TutorialSlide6.png";
import seventhSlideSrc from "./Images/TutorialSlide7.png";
import eigthSlideSrc from "./Images/TutorialSlide8.gif";
import "./tutorial.css";

function Tutorial() {
  const [slide, setSlide] = useState(1);
  const slides = useRef(null);
  const MAX_SLIDES = 8;

  function skip() {
    slides.current.style.display = "none";
  }

  return (
    <div className="tutorial">
      <button
        id="rewatch-tutorial"
        onClick={() => {
          setSlide(1);
          slides.current.style.display = "flex";
        }}
      >
        Rewatch Tutorial
      </button>
      <section className="slides" ref={slides}>
        <div id="skip">
          <button onClick={() => skip()}>Skip</button>
        </div>
        {slide === 1 ? (
          <Slides
            description="Welcome to the Pathfinding Visualizer Tutorial!"
            imgSrc={firstSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 2 ? (
          <Slides
            description="To move the start cell(green) and end cell(red) click and drag them to
          your desired position."
            imgSrc={secondSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 3 ? (
          <Slides
            description="Click on a empty cell and drag to start drawing a walls. Click on a wall cell and drag to start erasing walls."
            imgSrc={thirdSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 4 ? (
          <Slides
            description="Click any of the pathfinding algorithms to execute them."
            imgSrc={fourthSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 5 ? (
          <Slides
            description="Clearing the Entire grid will clear walls and paths.
          The stop search button is disabled until a pathfinding algorithm is in execution.
          Once in execution you may stop it by pressing 'Stop Search'."
            imgSrc={fifthSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 6 ? (
          <Slides
            description="The animation interval controls speeding up or slowing down the pathfinding visualization (does not control maze visualization speed).
          Can cross diagonals allows the pathfinding algorithm to move diagonally across squares, you can disable this."
            imgSrc={sixthSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 7 ? (
          <Slides
            description="Click this button to generate a maze through recursive division and put the algorithms to the test."
            imgSrc={seventhSlideSrc}
          />
        ) : (
          <></>
        )}
        {slide === 8 ? (
          <Slides
            description="You can also battle against the algorithm, but note that you cannot place walls where the algorithm has already searched."
            imgSrc={eigthSlideSrc}
          />
        ) : (
          <></>
        )}
        <div className="lower">
          <button
            onClick={() => {
              if (slide - 1 < 1) {
                return;
              }
              setSlide(slide - 1);
            }}
          >
            Previous
          </button>
          <p>Slide {slide + "/" + MAX_SLIDES}</p>
          <button
            onClick={() => {
              if (slide >= MAX_SLIDES) {
                skip();
                return;
              }
              setSlide(slide + 1);
            }}
          >
            {slide === MAX_SLIDES ? "Finish" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Tutorial;
