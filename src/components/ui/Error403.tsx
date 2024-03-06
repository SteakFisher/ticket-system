import React from 'react';
import './Error403.css';

function Bat() {
  return (
    <div className="bat">
      <img className="wing leftwing" 
           src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png" alt="bat wing" />
      <img className="body"
           src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png" alt="bat body" />
      <img className="wing rightwing"
           src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png" alt="bat wing" />
    </div>
  );
}

function MainContainer() {
  return (
    <div className="maincontainer">
      <Bat />
      <Bat />
      <Bat />
      <img className="foregroundimg" src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/HauntedHouseForeground.png" alt="haunted house" />
      <h1 className="errorcode">ERROR 403</h1>
      <div className="errortext">This area is forbidden. Turn back now!</div>
    </div>
  );
}

export default MainContainer;