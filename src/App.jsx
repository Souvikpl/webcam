import React, {useState} from 'react';
import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import CountDowns from "./Countdown";
import Base64Downloader from 'react-base64-downloader';



const App = () => {


  const { webcamRef, boundingBox, detected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
      
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame, width, height }: CameraOptions) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });
  const [image, setImage]=useState();
  
  const capture = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
  };
  
  const Timer = () =>{
    if(!image && detected){
      capture()
      document.getElementById('hide').style.visibility='hidden';
    }
    else if(!detected){
      alert('No Face Detected! Retake again!');
    }
  };

  // const retake=()=>{
  //    setImage()
  //    setTimeout(capture,3000)
  // };

  const startTimer=()=>{

    document.getElementById("count").hidden = !document.getElementById("count").hidden;

    var counter = 3;
    setInterval(function() {
      counter--;
      if (counter >= 0) {
      var  span = document.getElementById("count");
        span.innerHTML = counter;
      }
      if (counter === 0) {
          setImage()
          capture()
          clearInterval(counter);
      }
       if (counter <= 0)
      {
        document.getElementById("count").hidden = !document.getElementById("count").hidden;
        document.getElementById('count').style.visibility = 'hidden';
        document.getElementById('hide').style.visibility='hidden';
      }
      else
      {
        document.getElementById('count').style.visibility = 'visible';
        document.getElementById('hide').style.visibility='visible';
      }
    }, 1000);

  }

  
  // var fs = require("fs");
  // var base64String =image;
  // fs.writeFile("/home/souvikkumarpaul/base64/image.jpg", base64String, {encoding: 'base64'},function(err){
  
  //         if(err)
  //         {
  //             console.log(err);
  //         }
  //         else
  //         {
  //             console.log("file created");
  //         }
  
  //         })
  const base64 = image;

  return (
    <>
    <div className='size'>
      {/* <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p> */}
      <div  style={{ width: '100%', height: '100%', position: 'relative'  }}>
        {boundingBox.map((box, index) => (
          <div id='hide'
            key={`${index + 1}`}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          
        />

        <div className='overlay-container'>
          <CountDowns
          onTimesup={Timer}
        />
        </div>
        <span className='counter' id="count" hidden>3</span>
      </div>
    </div>
    <br/>
    <button className='button' onClick={startTimer}>Retake</button>
      <br/>
      <br/>{image && (
        <img
        src={image} alt=''
        />
      )}
      <br/>
      <Base64Downloader base64={base64} downloadName="image">
      Click to download
    </Base64Downloader>
      </>
  );
};

export default App;