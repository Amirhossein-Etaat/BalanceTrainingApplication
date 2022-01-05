let video;
let poseNet;
//let poses = [];
let pose;

let options = {
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.04, // before 0.1  // it was 0.04
  maxPoseDetections: 1,  // before 5
  scoreThreshold: 1,
  nmsRadius: 20,             // before 20
  detectionType: 'single',
  inputResolution: 200,
  multiplier: 0.75,       //before 
  quantBytes: 2,
};

// it was 0.4 before  0.04
let vposes = 0.04;
let sizeNodes = 20;

let rangeMotionX = 200; // range of motion
let rangeMotionY = 200; // lenght range motion 


let humanOutlineDetection;

//let sourcePos;
//let targetPos;

//Images
let humanSkeleton;
let shoulderExercisePic;
let ballPic;
let obstaclePic;
let exercise1Pic;
let chairPic;

let exercise1Button;
let exercise2Button;
let exercise3Button;
let exerciseButtonSizeValue=0.25;


let isInOutline = true;

let humanOutlinePosD1;
let humanOutlinePosD2;
let humanOutlineRightKnee;
let humanOutlineRightLeft;

let sensitivityOutlineRange = 100;
let sensitivityKneeRange = 0;

let sensitivityOutlineRangeMax = 480; // 220 in bode ghablan
let sensitivityOutlineRangeMin = 300; //100 in bode ghablan

let sensitivityKneeRangeMax=100;


let collectingDataTimer = -2;
let start_collectingDataTimer=false;
//

let startExercise = false;
let trainingSong;
//right shoulder training

let showTheGiftTimer=0;
 
//let islineFounded=false;
let speechRec;
let speech;
let speechText=['',''];
let speechTimer=-1;
let speechTimeCounter=0;

let startClockTimer=false;
let clockCounter=0;
let clockCounterUI=0;2
let scoreCounter=0;
let scoreCounterUI=0;

let welcomeTimeCounter=0;
let welcomeMaxTime=4;
let welcomeFinished=false;
var _divWelcome;
var _divEndScreen;

var canvasInterface;

let humanOutlineSize=0.65;
let obstaclePicSize=0.5;
let obstaclePicYDisplay=0.3;

let exercise1PicSize=0.5;
let lineSize=1.25;
let chairSize=1.2;

let leftKnee=null;
let rightKnee=null;
let rightshoulder=null;
let leftshoulder=null;
let rightElbow=null;
let rightHip=null;

// exercise timer
let exerciseNumbers=0;
let exerciseCounts=10; // how many time do the heel raises excercise
let exerciseTimeCounter=-7;
let start_exerciseTimeCounter=false;

//let obstacleTouchedTimer=0;
//let start_obstacleTouchedTimer=false;
let start_detectingHeel=false;
let isRightSideStepping=false;
let detectingHeelTimer=4;
let beginingHeepPoint;
let displayText='';

let waiting_Maxdetection=11;
let waiting_detection=0;
let waiting_detectionEnable=true;


var heights=500;
var widths=500;
var widthExtra=55;

var TESTMODE=false;
var stopTraining=false;
var disableBullets=true;

 function preload() {
   
   humanSkeleton = loadImage('Images/body-outline-box.png');
   exercise1Pic=loadImage('Images/exercise2-selected.png');
   chairPic=loadImage('Images/chair.png');
 
   obstaclePic=loadImage('Images/rect-box.png');
   
   exercise1Button=createImg('Images/exercise1.png');
   exercise2Button=createImg('Images/exercise2-selected.png');
   exercise3Button=createImg('Images/exercise3.png');  
   exercise1Button.hide();
   exercise2Button.hide();
   exercise3Button.hide();

}

//window.onresize = function() {
//  canvas.resize (windowWidth, windowHeight);
//};




function setup() {
  
   heights=windowHeight;
   widths=heights*1.3333;
  
  
   canvasInterface=createCanvas(widths,heights );


  
  shoulderExercisePic=createImg('Images/side-stepping.gif');
  shoulderExercisePic.hide();
  
 
 // console.log(windowHeight +" "+ widths);
//  console.log(humanSkeleton.height);
  
    console.log(humanOutlineSize);

  humanOutlineSize=((heights*1.34)/humanSkeleton.height);
  //    console.log('Final humanOutlineSize : '+ humanOutlineSize);
  //    console.log('Final humanOutlineSize : '+ obstaclePic.height);
//0.23378
 obstaclePicSize=((heights*0.11)/obstaclePic.height);
  exercise1PicSize=((heights*0.075)/obstaclePic.height);
  chairSize=((heights*0.5)/chairPic.height);
  
  //0.25
 // console.log('FFFFF   : '+(exerciseButtonSizeValue*exercise2Button.height)/ heights );

  exerciseButtonSizeValue=((heights*0.23)/exercise2Button.height);
    //      console.log('exerciseButtonSizeValue   : '+exerciseButtonSizeValue );
     //     console.log('22 exerciseButtonSizeValue   : '+heights/exercise2Button.height*exerciseButtonSizeValue );
      //    console.log('33 exerciseButtonSizeValue   : '+heights/exercise2Button.height*exerciseButtonSizeValue );

  sensitivityOutlineRange= (humanSkeleton.width*humanOutlineSize)/2;
  
   sensitivityOutlineRangeMin=  (humanSkeleton.width*humanOutlineSize)+ (humanSkeleton.width*humanOutlineSize)/10;
   sensitivityOutlineRangeMax=  (humanSkeleton.width*humanOutlineSize) + (humanSkeleton.width*humanOutlineSize)/1.2;

  lineSize=3.25;   // it was 2.5 in the single leg training
  sensitivityKneeRangeMax=(lineSize+0.1)*(obstaclePic.height*obstaclePicSize); // this has been used for single-leg standing
  //sensitivityKneeRangeMax=lineSize; // I set lineSize because in Heel Raises we want to have some limitations for walking the user
//    console.log('sensitivityOutlineRange : '+sensitivityOutlineRange);

//  console.log('sensitivityKneeRangeMax : '+sensitivityKneeRangeMax);

//  console.log('sensitivityOutlineRangeMin : '+sensitivityOutlineRangeMin);
//  console.log('sensitivityOutlineRangeMax : '+sensitivityOutlineRangeMax);
  
  widthExtra=(exerciseButtonSizeValue*exercise2Button.width)/1.5;
  
    canvasInterface.position((windowWidth - widths) / 2+widthExtra, 0);
  canvasInterface.style('border', '2px solid white');

     canvasInterface.style('display', 'none');

  
 // createCanvas(1920, 1440);
  //createCanvas(windowWidth,windowHeight);
//let constraints = {
//    video: {
//      mandatory: {
//        maxWidth: 1920,
//        maxHeight: 1440
//      }
 //   },
 //   audio: false
//  };

//  var back=createP('p');
  
  //video = createCapture( constraints );

   video = createCapture(VIDEO);
  video.size(widths, heights);
  console.log(widths +' '+ heights);
   //createCanvas(1400, 1050);
 // createCanvas(1380, 750);
 // createCanvas(1280, 960);
  //createCanvas(1024, 768);
  //createCanvas(640, 480);
  
//  video = createCapture(VIDEO);
 // video.size(width, height);
  speech=new p5.Speech();
  speech.setVoice('Google UK English Female'); //Google UK English
  speech.interrupt=true;

  speechRec=new p5.SpeechRec(navigator.language||'en-US',gotSpeech);
 // let continuous=false;
  //let interim=false;
  //speechRec.start();
  speechRec.continuous = false; 

  speechRec.onError = restartspeechRec;
  speechRec.onEnd = restartspeechRec;
  speechRec.start();
  
 //speechRec.continuous=true;
// speechRec.interim=false;
  
 //angleMode(DEGREES);
 // speech.speak('hi there');
  //startToSpeech('hi there');
  
  
    //  trainingSong = loadSound('Songs/mainSong.mp3');
    //trainingSong.play();

  /* 
  // Create the model without a video element
poseNet = ml5.poseNet(video,modelReady);

// This sets up an event that listens to 'pose' events
poseNet.on('pose', function (results) {
   poses = results;
});

  poseNet.singlePose(video)
*/

  //   poseNet = ml5.poseNet(  modelReady, options);

  poseNet = ml5.poseNet(video, options, modelReady);
  poseNet.on('pose',gotPoses);

  //   this.singlePose();
 
  //back.style('padding-left','490px');
  video.hide();
  
  // this part is for the timer

setInterval(timeCounter,1000);
  
 // const ut = new SpeechSynthesisUtterance('No warning should arise');
//speechSynthesis.speak(ut);
  
   initializeTheExerciseUI();
  
     
   
   // FOR EDITOR TESTING
   if(TESTMODE)
     {
       collectingDataTimer = -2;
  welcomeFinished=true;
        startExercise = true;
        isInOutline = false;
        _divWelcome.style('display', 'none');
      canvasInterface.style('display', 'block');
        showTheGiftTimer=22; 
          startClockTimer=true;
        start_collectingDataTimer=true;
       sensitivityOutlineRange = 10000000000;
       sensitivityKneeRange=1000000000;
       
        exerciseTimeCounter=-10;
        start_exerciseTimeCounter=true;
 //      speechTimer=2;
     }
   // FOR EDITOR TESTING
 }

function restartspeechRec(){
 
	speechRec.start();
}

function initializeTheExerciseUI()
{
   exercise1Button.show();
   exercise2Button.show();
   exercise3Button.show();
  
  //let widthe=(windowWidth/2) - (widths/2);
  let exerciseHeightRatio= heights/exercise1Button.height;
  
  let exerciseFontFactor=55*exerciseButtonSizeValue;
  //let exerciseFontFactor=55*exerciseButtonSizeValue;

 // console.log('exerciseButtonSizeValue :'+exerciseButtonSizeValue);
  //    exercise1Button.size(exercise1Button.width*exerciseButtonSizeValue, exercise1Button.height*exerciseButtonSizeValue);

  exercise1Button.size(exercise1Button.width*exerciseButtonSizeValue, exercise1Button.height*exerciseButtonSizeValue);
  
 exercise1Button.position(((exercise1Button.width*0.25)), (0.5*(exercise1Button.height)));
  
  //exercise1Button.position(((exercise1Button.width/5)), heights/3- exercise1Button.height);
  
   var div1 = createDiv('').size((exercise1Button.width)*1.25, (exercise1Button.height)/10);
      
    div1.html(' Heel Raises Training', true);   
    div1.center(); 
    div1.style('font-size', exerciseFontFactor);
    div1.style('color', 'white');
   // div2.style('border', '1px solid white');
    div1.style('text-align', 'center');
    div1.style('left', (0.15*(exercise1Button.width)));
    div1.style('top', 0.35*(exercise1Button.height));
  
  //........
  
  
   exercise2Button.size(exercise2Button.width*exerciseButtonSizeValue,exercise2Button.height*exerciseButtonSizeValue);

  //windowWidth-(5*(exercise2Button.width*exerciseButtonSizeValue))
  
  exercise2Button.position(((exercise2Button.width*0.25)), (1.75*(exercise2Button.height)));
  
// exercise2Button.position(((exercise2Button.width*exerciseButtonSizeValue)), (heights/2)-(exercise2Button.height*exerciseButtonSizeValue));

   var div2 = createDiv('').size((exercise2Button.width)*1.25, (exercise2Button.height)/10);
      
    div2.html(' Side Stepping Training', true);   
    div2.center(); 
    div2.style('font-size', exerciseFontFactor);
    div2.style('color', 'white');
   // div2.style('border', '1px solid white');
    div2.style('text-align', 'center');
    div2.style('left', (0.15*(exercise2Button.width)));
    div2.style('top', (1.6*(exercise2Button.height)));
  
  //....................
  
    exercise3Button.size(exercise3Button.width*exerciseButtonSizeValue, exercise3Button.height*exerciseButtonSizeValue);
  
  
    exercise3Button.position(((exercise3Button.width*0.25)), (3*(exercise3Button.height)));


  
   var div3 = createDiv('').size((exercise3Button.width)*1.25, (exercise3Button.height)/10);
    div3.html(' Single Leg Training', true);   
    div3.center();
    div3.style('font-size', exerciseFontFactor);
    div3.style('color', 'white');
   // div2.style('border', '1px solid white');
    div3.style('text-align', 'center');
    div3.style('left', (0.15*(exercise3Button.width)));
    div3.style('top', (2.85*(exercise3Button.height)));
  
  //...............................
  exercise3Button.mousePressed(exercise3ButtonClicked);
  exercise1Button.mousePressed(exercise1ButtonClicked);

  exercise3Button.mouseOver(overMouseOnExercise3Buttons);
  exercise3Button.mouseOut(outMouseOnExercise3Buttons); 
  
  
  exercise1Button.mouseOver(overMouseOnExercise1Buttons);
  exercise1Button.mouseOut(outMouseOnExercise1Buttons); 
  
  //...............
  
  var _div = createDiv('').size((exercise1Button.width)*0.85, (exercise1Button.height)*0.1);
      
    _div.html('EXERCISES', true);       
    _div.center();
    _div.style('font-size', exerciseFontFactor*1.25);  
    _div.style('color', 'white');
    _div.style('border', '1px solid white');
    _div.style('text-align', 'center');
    _div.style('left', (exercise1Button.width)*0.35);
    _div.style('top', (exercise1Button.height)*0.1);
 
   var _div1 = createDiv('').size((exercise1Button.width)*1.25, (exercise1Button.height)*0.1);
      
    _div1.html('Say "repeat" or "next" to redo/next the exercise', true);       
    _div1.center();
    _div1.style('font-size', exerciseFontFactor*0.75);  
    _div1.style('color', 'white');
//    _div1.style('border', '1px solid white');
    _div1.style('text-align', 'center');
    _div1.style('left', (exercise1Button.width)*0.15);
    _div1.style('top', (exercise1Button.height)*4.1);
  
    _divWelcome = createDiv('').size((exercise1Button.width)*5, (exercise1Button.height)*0.7);
      
    _divWelcome.html('Welcome to the Side Stepping Exercise<br><br><br><br><br>Please wait...', true);   
    _divWelcome.center();
    _divWelcome.style('font-size', exerciseFontFactor*3);  
    _divWelcome.style('color', 'white');
//    _divWelcome.style('border', '1px solid white');
    _divWelcome.style('text-align', 'center');
    _divWelcome.style('left', (windowWidth/ 2)-(_divWelcome.width)/3);
    _divWelcome.style('top', heights/2-(_divWelcome.height)/2);
  
   // _divWelcome.style('display', 'none');

    _divEndScreen = createDiv('').size((exercise1Button.width)*5, (exercise1Button.height)*0.7);
      
    _divEndScreen.html('Great work! You have successfully completed the Side Stepping exercise.<br><br>Please say "repeat" or "next" to redo or go to the next exercise', true);       
    _divEndScreen.center();
    _divEndScreen.style('font-size', exerciseFontFactor*3);  
    _divEndScreen.style('color', 'white');
//    _divWelcome.style('border', '1px solid white');
    _divEndScreen.style('text-align', 'center');
    _divEndScreen.style('left', (windowWidth/ 2)-(_divWelcome.width)/3);
    _divEndScreen.style('top', heights/2-(_divWelcome.height));
  
      _divEndScreen.style('display', 'none');

 /*  var _div2 = createDiv('').size((exercise1Button.width)*0.85, (exercise1Button.height)*0.1);
      
    _div2.html('Say "next"', true);       
    _div2.center();
    _div2.style('font-size', exerciseFontFactor*1.25);  
    _div2.style('color', 'white');
//    _div1.style('border', '1px solid white');
    _div2.style('text-align', 'center');
    _div2.style('left', (exercise1Button.width)*0.35);
    _div2.style('top', (exercise1Button.height)*4.2);
  
  */
  
 /* var _div1 = createDiv('').size(110, 20);
      
    _div1.html('TRAINING 1', true);       
    _div1.center();
    _div1.style('font-size', '18px');  
    _div1.style('color', 'white');
    _div1.style('border', '1px solid white');
    _div1.style('text-align', 'center');
    _div1.style('left', windowWidth-130);
    _div1.style('top', '10');
    */
}
function gotSpeech()
{
 // console.log( 'gotSpeech');

//  if(speechRec.resultValue)
 // console.log(speechRec.resultString);
  
  
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('next'))
    {
        startToSpeech('Ok. The next exercise is selected');
        exercise3ButtonClicked();

    }
  
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('repeat'))
      {
          startToSpeech('Ok. The exercise is repeated');
          exercise2ButtonClicked();
      }
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('previous'))
      {
          startToSpeech('Ok. The previous exercise is selected');
          exercise1ButtonClicked();
      }
 /* 
    if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('redo'))
      {
      startToSpeech('Ok. The exercise is repeated');
          exercise2ButtonClicked();
      }
  */
}

function windowResized() {
  console.log("windowResized" ); 
  startToSpeech('It seems your web page has been resized. For better performance, please try to change the web page to full screen, and refresh the page again');
    speechTimer=-1;

}
function overMouseOnExercise3Buttons()
{
   // exercise2Button.class('blur');
  exercise3Button.style('border', '2px solid yellow')
}
function outMouseOnExercise3Buttons()
{
   // exercise2Button.class('none');
    exercise3Button.style('border', '0px solid yellow')
}
function overMouseOnExercise1Buttons()
{
    exercise1Button.style('border', '2px solid yellow')
 //   exercise3Button.class('blur');
}
function outMouseOnExercise1Buttons()
{
  exercise1Button.style('border', '0px solid yellow')
   // exercise3Button.class('none');
}
function exercise3ButtonClicked()
{
  window.location.href = "https://editor.p5js.org/Amirhossein/present/IV8YBltGX";
}
function exercise2ButtonClicked()
{
  window.location.href = "https://preview.p5js.org/Amirhossein/present/RAWFp47QB";
}
function exercise1ButtonClicked()
{
    window.location.href = "https://editor.p5js.org/Amirhossein/present/kJd99Cl0M";s
}

//padding-left:150px;
//padding-bottom:0px;
//padding-top:0px;

/*
async function singlePose() {
    const input = this.getInput(video);

    const pose = await this.net.estimateSinglePose(input, {flipHorizontal: this.flipHorizontal});
    const poseWithParts = this.mapParts(pose);
    const result = [{ pose:poseWithParts, skeleton: this.skeleton(pose.keypoints) }];
    this.emit('pose', result);
      console.log("%%%%%%%% hiiiiii"); 

    if (this.video) {
      return tf.nextFrame().then(() => this.singlePose());
            console.log("%%%%%%%% hiiiiii 2" ); 

    }

    if (typeof cb === 'function') {
                  console.log("%%%%%%%% hiiiiii 3" ); 

      cb(result);
    }

    return result;
  }
*/

function gotPoses(poses)
{
 // console.log(_poses);
  if(poses.length>0)
    {
      pose= poses[0];
    }
}
function modelReady() {
 // console.log("%%%%%%%% modelReady");

  //select('#status').html('First Balance Exercise');

  
  //  <p id='status'>Online Balance Rehabilitation Physical Therapy</p>

  
  // poseNet.singlePose(video).then( (res) => {
  // when we get a response, store the results to our poses[] array
  // then draw will do it's thing
  //     console.log("%%%%%%%% modelReady"); 

  //     poses = res;
  //   }).catch( (err) => {
  //     return err;
  //});

  // poseNet.singlePose(video); 
}

function mousePressed()
{
//     let voices=speech.voices;
 // let voice=random(voices);
 //   speech.setVoice('Google UK English Female'); //Google UK English
//    speech.speak('hi there');
  
//  startToSpeech('hi');

//   console.log(voice.name);
//  speech.setVoice(voice.name);
 //   speech.speak('hi there');


}

function draw() 
{    
  if(stopTraining)
    return;
    
  displayingVideo();
//console.log( speechRec.continuous);

  if(!welcomeFinished)
    return;
    
  updateKeyPoints();
  detectingHumanOuatline();
  updateFunctions();
 //..........
}
function clearSpeeches()
{
  speechTimer=2;
  speechText = [];
}
function startToSpeech(text)
{
    if(stopTraining)
     return;
  
  for (let i = 0; i < speechText.length; i++) 
    {
      if(speechText[i]==text)
        return null;
    }
   //   console.log('P0  '+text+' '+speechTimer);
     // speech.setVoice('Google UK English Female'); //Google UK English
     speech.speak(text);
      speechText.push(text);

 if(speechTimer!=-1 && speechTimeCounter>speechTimer)
    {
        speechText = [];
      speechTimeCounter=0;
    }
  
 /* 
  if(speechTimeCounter>speechTimer)
    {
        speechText = [];
      speechTimeCounter=0;
    }
else
  {
  for (let i = 0; i < speechText.length; i++) 
    {
      if(speechText[i]==text)
        return null;
    }
  }
      console.log('P0  '+text+' '+speechTimer);
      speech.setVoice('Google UK English Female'); //Google UK English
      //speech.speak(text);
      speechTimeCounter=1;
      speechText.push(text);
      
  */
  
  
 /* if(speechText==text)
    {
      if(speechTimeCounter>speechTimer)
        {
           console.log('P0  '+speechText+'  '+speechTimeCounter+' '+speechTimer);
           speech.setVoice('Google UK English Female'); //Google UK English
           speech.speak(text);
           speechTimeCounter=1;
           speechText.push(text);
        }
    }
  else
  {
    console.log('P1  '+speechText+'   |||||  '+text);
    speech.setVoice('Google UK English Female'); //Google UK English
    speech.speak(text);
    speechTimeCounter=1;
    speechText.push(text);
  }
  */
}
function displayingVideo()
{
    // image(exercise2Button, 0, 0);
  //image(exercise2Button, 0, 0, exercise2Button.elt.width, exercise2Button.elt.height);

//  image(shoulderExercisePic, widths / 2 - 160, height / 2 - 160, shoulderExercisePic.width * 0.1, shoulderExercisePic.height * 0.1)
  //poseNet.singlePose(video)

  /* ### EDITOR
   */

  //isInOutline = false;
 // startExercise = true;
  
  //........
   tint(255, 255, 255, 255);
  // image(video, 0, 0, widths, height);
  
 
push();
translate(widths,0);
scale(-1, 1);
image(video, 0, 0, widths, heights);
pop();
  
  //...........
    
   fill(0, 0, 0, 220);
   // noStroke(0, 0, 0, 255);
    stroke(255,255,255,150);
    strokeWeight(2);
    rect(0, 0, widths, 25);
  //
  
  if(!welcomeFinished && welcomeTimeCounter>welcomeMaxTime)
    {
      welcomeFinished=true;
      _divWelcome.style('display', 'none');
      canvasInterface.style('display', 'block');
    }
  
    if(waiting_detectionEnable && waiting_detection>waiting_Maxdetection )
    {
      waiting_detectionEnable=false;
      
    }
}
function timeCounter()
{
     //console.log('timer');
    speechTimeCounter++;

  if(!welcomeFinished)
    welcomeTimeCounter++;
  
     if (startClockTimer)  // start to count the time
       clockCounter++;

   if (start_collectingDataTimer &&isInOutline && collectingDataTimer <= 8) // counter for checking the outline
       collectingDataTimer++;
  
   if (startExercise && showTheGiftTimer <= 19)  // counter for showing the exercise
        showTheGiftTimer++;
         
  
  if(start_exerciseTimeCounter)
    exerciseTimeCounter++;
  
 // if(start_obstacleTouchedTimer)
  //  obstacleTouchedTimer++;
  
    
  if(waiting_detectionEnable)
    waiting_detection++;
  
}
function updateFunctions()
{
  
//   console.log(widths / 2 - 50 , height / 2 + 130);
 // clockCounter=10;
  clockHandler();
  
//  if (frameCount % 40 == 0 ) {
//    speechTimeCounter++;
//      }
  
    scoreHandler();

  
  
  //..
  
  // console.log('hiii');
      tint(255, 255, 255, 80);
  noStroke();
  noFill();
  image(exercise1Pic, ((exercise1Pic.width*exercise1PicSize)/10), heights-(exercise1Pic.height*exercise1PicSize), exercise1Pic.width * exercise1PicSize, exercise1Pic.height * exercise1PicSize-(exercise1Pic.height*exercise1PicSize)/10);
  
  //image(exercise1Pic,200,100,200,200);
  
  //..
}

function clockHandler()
{
  if(clockCounter==10)
    clockCounterUI=7;
  
  if(clockCounter==100)
    clockCounterUI=12;
                  
     push();

  // this section is for its text adjustment
  textSize(20);
  fill(255, 100, 150,255);
  strokeWeight(1);
  stroke(255, 100, 150,255);
 // text(clockCounter, widths-50-clockCounterUI , 105);
 // text('TIME', widths-70, 50);
 
  
    // this sectoin is for circle and filling part
 // translate(widths-45 , 100);
 // rotate(-91);
  // let sc = second();

 // console.log(clockCounter);
  strokeWeight(8);
  stroke(255, 100, 150);
  noFill();


  // 103sec == 6000 // 10485 means 3 min
//  let secondAngle = map(clockCounter+0.001, 0, 10485, 0,360);
//    arc(0, 0, 70, 70, 0, secondAngle);
//  stroke(255, 100, 150,80);
 //   arc(0, 0, 70, 70, 0, 0);

 pop();
 // push();
 // rotate(secondAngle);
 // stroke(255, 100, 150);
 // line(0, 0, 35, 0);
 // pop();
}


function scoreHandler()
{
  if(scoreCounter==0)
    scoreCounterUI=0;

  if(scoreCounter==10 || scoreCounter==99)
    scoreCounterUI=7;
  
  if(scoreCounter==100 || scoreCounter==999)
    scoreCounterUI=12;  
  
  push();
  //rotate(9.3);

  // this section is for its text adjustment
  textSize(20);
  fill(123, 239, 178);
  strokeWeight(1);
 // stroke(255, 100, 150);
  stroke(77, 175, 124);
  //clockCounter, widths-50-clockCounterUI , 75
  text(scoreCounter, 50-scoreCounterUI, 105);

  text('COUNT', 20, 50);

  
  // this sectoin is for circle and filling part
//  translate(55, 100);
    
 // rotate(-91);
  // let sc = second();

 // console.log(scoreCounter);
  strokeWeight(8);
  //stroke(255, 100, 150);
  
  //fill(123, 239, 178);
  //strokeWeight(1);
 // stroke(255, 100, 150);
  stroke(123, 239, 178);
  
  noFill();


  // 103sec == 6000 // 10485 means 3 min
 // let secondAngle = map(scoreCounter*18+0.001, 0, 10485, 0,360);
 //   arc(0, 0, 70, 70, 0, secondAngle);
  //  stroke(77, 175, 124,80);
  //  arc(0, 0, 70, 70, 0, 0);
  
  pop();
}


function detectingHumanOuatline() {
  
  if(TESTMODE)
     return;
  
  if (!waiting_detectionEnable && humanOutlinePosD1 != null && humanOutlinePosD2 != null && humanOutlinePosD1.x < (widths / 2 + sensitivityOutlineRange) && humanOutlinePosD1.x > (widths / 2 - sensitivityOutlineRange) && humanOutlinePosD2.x < (widths / 2 + sensitivityOutlineRange) && humanOutlinePosD2.x > (widths / 2 - sensitivityOutlineRange)
     &&
       humanOutlineRightKnee!=null && humanOutlineRightLeft!=null
     &&
      humanOutlineRightKnee.y + sensitivityKneeRange> heights-(lineSize*(obstaclePic.height*obstaclePicSize)) && humanOutlineRightLeft.y + sensitivityKneeRange> heights-(lineSize*(obstaclePic.height*obstaclePicSize))
     )
  { 
   // console.log('outline detected');
    if (isInOutline) 
    {
      // green line
         stroke(26, 255, 0, 120);
      strokeWeight(10);
    line(200,heights-(lineSize*(obstaclePic.height*obstaclePicSize)),widths-200,heights-(lineSize*(obstaclePic.height*obstaclePicSize)));
      
      // human outline
      stroke(0, 0, 0, 255);
      tint(26, 255, 0, 255);
      image(humanSkeleton, widths / 2 - ((humanSkeleton.width*humanOutlineSize)/2), heights / 2 - ((humanSkeleton.height*humanOutlineSize)/2.8), humanSkeleton.width *humanOutlineSize, humanSkeleton.height *humanOutlineSize)
    //............
      
     /* 
      textSize(20);
      fill(255, 255, 185, 220);
      noStroke(0, 0, 0, 255);
      rect(0, 0, width, 25);
      fill(0, 0, 0, 225);
      stroke(225);
      strokeWeight(1);
*/
      
       textSize(20);
    fill(0, 0, 0, 220);
   // noStroke(0, 0, 0, 255);
    stroke(255,255,255,150);
    strokeWeight(2);
    rect(0, 0, widths, 25);
    fill(255, 255, 255, 225);
    stroke(80);
    strokeWeight(1);

      
     // console.log("collectingDataTimer " + collectingDataTimer);

      if (collectingDataTimer >= -2 && collectingDataTimer< 0)
        {
         text('The position of your body is correct!', (widths /2)-170, 20);
         //startToSpeech('Your knees are under the line!');
          startToSpeech('The position of your body is correct');

        }

      if (collectingDataTimer >= 0 && collectingDataTimer< 4)
        {
          text('Great! Hold still while we detect your position', widths / 2 - 180, 20);
          startToSpeech('Great, Hold still while we detect your position');
        }
      if (collectingDataTimer >= 4 && collectingDataTimer< 6)
        {
          text('Keep you position..', widths / 2 - 120, 20);
        //  startToSpeech('Keep you position..');
        }
      if (collectingDataTimer >= 6 && collectingDataTimer< 9)
        {
          text('Please try to keep your position while standing in front of the camera', widths / 2 - 300, 20);
          startToSpeech('Please try to keep your position while standing in front of the camera');

//          startToSpeech('Rotate your body 90 degree to the right like the training video');
        }
      // if(collectingDataTimer=>2 && collectingDataTimer<=3)
      //  text('Wait.. '+collectingDataTimer, widths/2-20,20);
      if (collectingDataTimer == 9 )
      {
        text('Are you ready?', widths / 2 - 20, 20);
      //  startToSpeech('The position of your body sould be alike the training');
        collectingDataTimer = -2;
        startExercise = true;
        isInOutline = false;
        
        if(showTheGiftTimer>20) 
          {
            startClockTimer=true;
              exerciseTimeCounter=-7;
            start_exerciseTimeCounter=true;
      
      clearSpeeches();
          }
        
        sensitivityOutlineRange = sensitivityOutlineRangeMax;
        sensitivityKneeRange=sensitivityKneeRangeMax;
      }
      //****
 //     if (frameCount % 50 == 0 && collectingDataTimer <= 3) {
 //       collectingDataTimer++;
 //     }
//****
      
      start_collectingDataTimer=true;
    } 
    
    
  } 
  else {
    
 //     console.log("isInOutline " + isInOutline);

    if (collectingDataTimer > 0)
      collectingDataTimer = -2;

      start_collectingDataTimer=false;
    
    if (!isInOutline)
      isInOutline = true;

    if (startExercise) 
    {
      sensitivityOutlineRange = sensitivityOutlineRangeMin;
      sensitivityKneeRange=0;
      startExercise = false;
    }
    
    if(startClockTimer)
      startClockTimer=false;
    
    if(start_exerciseTimeCounter)
      {
        start_exerciseTimeCounter=false; 
      }
    //  speechTimer=15;
    
 //   if(islineFounded)
   //   islineFounded=false;
    
    humanOutlinePosD1 = null;
    humanOutlinePosD2 = null;

    if(shoulderExercisePic.isShowing)
      shoulderExercisePic.hide();
    
    // displaying the knee line
    stroke(255, 255, 255, 80);
      strokeWeight(5);
      line(200,heights-(lineSize*(obstaclePic.height*obstaclePicSize)),widths-200,heights-(lineSize*(obstaclePic.height*obstaclePicSize)));
    //...
    
    // diplayin human outline
    stroke(0, 0, 0, 255);
    // tint(26,255,0,255);
    tint(255, 255, 255, 255);
    image(humanSkeleton, widths / 2 - ((humanSkeleton.width*humanOutlineSize)/2), heights / 2 - ((humanSkeleton.height*humanOutlineSize)/2.8), humanSkeleton.width *humanOutlineSize, humanSkeleton.height *humanOutlineSize)
//...
    
    textSize(20);
    fill(0, 0, 0, 220);
   // noStroke(0, 0, 0, 255);
    stroke(255,255,255,150);
    strokeWeight(1);
    rect(0, 0, widths, 25);
    fill(255, 255, 255, 225);
    stroke(80);
    strokeWeight(1);
    
    speechTimer=-1;

     text('Please stand in front of the camera in a way that your knees are under the line', widths / 2 - 350, 20);
  startToSpeech('Please stand in front of the camera in a way that your knees are under the line');
//    text('Please place your body into the outline. Your knees should be straight and under the white line', widths / 2 - 400, 20);
 // startToSpeech('Please place your body into the outline. Your knees should be straight and under the white line');

  }
}
//let scorecal=true;
function updateKeyPoints() {

//tint(255, 50, 50, 190);
                
  //  image(obstaclePic, widths / 2 - obstaclePic.height/2 , height-obstaclePic.height/2, obstaclePic.widths * 0.5, obstaclePic.height * 0.5);
//    image(obstaclePic, widths / 2 -( (obstaclePic.height*obstaclePicSize)/2) , height-(obstaclePic.height*obstaclePicSize), obstaclePic.widths * obstaclePicSize, obstaclePic.height * obstaclePicSize);
  
  
 // for (let i = 0; i < poses.length; i++) {
  //    console.log( poses[i]);
  
  leftKnee=null;
  rightKnee=null;
  rightshoulder=null;
  leftshoulder=null;
  rightElbow=null;
  rightHip=null;
  
if(pose!=null)
  {
    let _pose = pose.pose;
   
    
    for (let j = 0; j < _pose.keypoints.length; j++) 
    {

      let keypoint = _pose.keypoints[j];
      
       if (keypoint.score > vposes) 
       {

        //      console.log( keypoint);

        //   if(isInOutline)
        //   {
        if (keypoint.part == 'rightShoulder')  
          {
            humanOutlinePosD1 = keypoint.position;
        //    console.log('shoulder',humanOutlinePosD1);
          } 
        
        if (keypoint.part == 'leftEye')
          {
            humanOutlinePosD2 = keypoint.position;
          }
         
          if (keypoint.part == 'rightKnee')
              {
                  rightKnee=keypoint.position;
              }
          if (keypoint.part == 'leftKnee')
              {
                   leftKnee  =keypoint.position;
              }
         
         
           if (keypoint.part == 'rightHip')
              {
                   rightHip  =keypoint.position;
              }
         
         
         // these two statements can be removed
 if(keypoint.part=='leftAnkle')
  {
    showEllipseStroke(keypoint.position);
  }
   if(keypoint.part=='rightAnkle')
  {
    showEllipseStroke(keypoint.position);
  }      
 
        if (startExercise) 
        {
   //********       
    //  if (frameCount % 100 == 0 && showTheGiftTimer < 5) {
    //     showTheGiftTimer++;
    //  }
    //*********
if(showTheGiftTimer<=20)   // display gift video for training
{
    
    fill(0, 0, 0, 255);
    rect(0,0, widths+200, heights+200);
  
   //image(shoulderExercisePic, widths / 2 - 200, height / 2 - 160, shoulderExercisePic.widths * 0.7, shoulderExercisePic.height * 0.7);
 
    shoulderExercisePic.show();
  
    /*
    textSize(20);
    fill(255, 255, 185, 220);
    noStroke(0, 0, 0, 255);
    rect(0, 0, widths, 25);
    fill(0, 0, 0, 225);
    stroke(225);
    strokeWeight(1);
  */
     textSize(20);
    fill(0, 0, 0, 220);
   // noStroke(0, 0, 0, 255);
    stroke(255,255,255,150);
    strokeWeight(2);
    rect(0, 0, widths, 25);
    fill(255, 255, 255, 225);
    stroke(80);
    strokeWeight(1);
  if (showTheGiftTimer >= 1 && showTheGiftTimer<4)
    {
      text('Let’s try the Side Tap exercise now', widths / 2 - 180, 20);
      startToSpeech('Let’s try the Side Tap exercise now');
    //  speechTimer=40;

    }
  if (showTheGiftTimer >= 4 && showTheGiftTimer<12)
    {
      text('Step sideways by moving one foot to the side, and then move it back', widths / 2 - 300, 20);
      startToSpeech('Start with your feet together and knees slightly bent, Step sideways by moving one foot to the side, and move it back to join the other foot');
      // try to full step on both sides
    }
  if (showTheGiftTimer >= 12 && showTheGiftTimer<13)
    {
   //   text('Alright! try to touch the chair and do the side step training for improving your balance', widths / 2 - 380, 20);
     // startToSpeech('Try to touch the chair and do the side step training for your physical coordination');
    }
  if (showTheGiftTimer >= 13 && showTheGiftTimer<20)
    {
        text('You can pretend to hold on to the virtual chair to help you balance', widths / 2 - 320, 20);
    //  text('Perfect. Your training started!', widths / 2 - 120, 20);      
     // startToSpeech('Try to put your lifted leg on the box for around 15 seconds! Perfect. Your training started!');
 
    startToSpeech('Whenever I say "Step right", please take a full right step, pause for 2 seconds, and when I say "Release”, move it back slowly, Perfect, we will do this exercise 10 times, You can pretend to hold on to the virtual chair to help you balance');

    //  speechTimer=30;
    } 
  if (showTheGiftTimer == 20)
    { 
      shoulderExercisePic.hide();
      // shoulderExercisePic.hide();
      showTheGiftTimer=25;
      startClockTimer=true;
 //     startToSpeech('If it is hard to stand your legs above the red line, you can rotate your camera 20 or 30 degrees towards down or you can use the box');
      
            exerciseTimeCounter=-7;
            start_exerciseTimeCounter=true;
      
clearSpeeches();
    }

    shoulderExercisePic. position( ((windowWidth / 2 )-shoulderExercisePic.width/2)+widthExtra, heights / 2-shoulderExercisePic.height/2);

     return null;
}          

          if (keypoint.part == 'leftEye' || keypoint.part == 'rightEye' || keypoint.part == 'nose' || keypoint.part == 'rightEar' || keypoint.part == 'leftEar') {} 
          
          else
          {      
         // console.log("Logg :"); 
       showEllipseStroke(keypoint.position);

          }
          
            if (keypoint.part == 'rightShoulder')
              {
                  rightshoulder=keypoint.position;
              }
          if (keypoint.part == 'leftShoulder')
              {
                   leftshoulder  =keypoint.position;
              }
           if (keypoint.part == 'rightElbow')
              {
                   rightElbow  =keypoint.position;
              }
          
     //     if (keypoint.part == 'rightShoulder')
     //     {
            
     //       sourcePos = keypoint.position;
         //     image(ballPic, widths / 2 - 0, height / 2 -0, ballPic.width , ballPic.height )
            //    console.log("sourcePos :"+ sourcePos); 
     //       if(islineFounded)
     //       {
     //        stroke(50, 255, 50, 255);
     //       }
     //       else
     //       {
     //       stroke(246, 36, 89, 255);
     //       }
            //noStroke();
 
       //     line(sourcePos.x, sourcePos.y, sourcePos.x - rangeMotionX, sourcePos.y - rangeMotionY);         
       
        //  if (keypoint.part == 'rightElbow') {
        //    targetPos = keypoint.position;
           //   tint(255, 255, 255, 255);
          //    image(ballPic, targetPos.x, targetPos.y, ballPic.width/2 , ballPic.height/2 )
            //     console.log("endPos :"+ targetPos); 
         // }
          
         // }
        }
      }
    }
          if(rightKnee!=null)
            {
                 humanOutlineRightKnee=rightKnee;
            }
          if(leftKnee!=null)
            {
              humanOutlineRightLeft=leftKnee;
            }
  }
  
   if (startExercise) 
        {
      //    console.log("staaaaaaaaaaaaaaaaa");
        drawSkeleton();

        tint(255, 255, 255, 255); 
          
              // display the chair pic
        image(chairPic, widths/2 -((chairPic.width*chairSize)/2) , heights-((chairPic.height*chairSize)), chairPic.width * chairSize, chairPic.height * chairSize);
          
          // display the obstacle pic // we don't need it in this exersice
    //    image(obstaclePic, widths / 2 -( (obstaclePic.width*obstaclePicSize)/2) , heights-((obstaclePic.height*obstaclePicSize)*obstaclePicYDisplay), obstaclePic.width * obstaclePicSize, obstaclePic.height * obstaclePicSize);
          
      
          // draw the hip line
 if(rightHip!=null)
              {
                
      stroke(123, 239, 178, 150);
      strokeWeight(10);
      line(25,rightHip.y,widths-25,rightHip.y);
 
              }
          
        exerciseCalculation();

      }
  else
    {
      // just show the user knees in the begining
      
   if(rightKnee!=null)
      {
        showEllipseStroke(rightKnee);
      }
  if(leftKnee!=null) 
      {
        showEllipseStroke(leftKnee);
      }

    }
}

function showEllipseStroke(keypoint)
{
  if(disableBullets)
  return;
  
   push();
    translate(widths,0);
    scale(-1, 1);
    fill(255, 70, 70, 120);
    noStroke();
    strokeWeight(20);
    ellipse(keypoint.x, keypoint.y, sizeNodes, sizeNodes);
    pop(); 
   
}



function drawSkeleton() 
{

 if(disableBullets)
  return;
  
 // for (let i = 0; i < poses.length; i++) {
  if(pose!=null)
    {
    let skeleton = pose.skeleton;

    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 255, 255, 90);
      strokeWeight(30);
      push();
      translate(widths,0);
      scale(-1, 1);
      fill(255, 255, 255, 220);
      //     line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
      curve(partA.position.x, partA.position.y, partA.position.x, partA.position.y, partB.position.x, partB.position.y, partB.position.x, partB.position.y);
pop();
    }
  }
}


function exerciseCalculation()
{
    /*  textSize(20);
      fill(255, 255, 185, 220);
      noStroke(0, 0, 0, 255);
      rect(0, 0, widths, 25);
      fill(0, 0, 0, 225);
      stroke(225,255,255,255);
      strokeWeight(1);
      tint(0, 0, 0, 255); 
*/
  
     textSize(20);
    fill(0, 0, 0, 220);
   // noStroke(0, 0, 0, 255);
    stroke(255,255,255,150);
    strokeWeight(2);
    rect(0, 0, widths, 25);
    fill(255, 255, 255, 225);
    stroke(80);
    strokeWeight(1);
  
 // start_exerciseTimeCounter=true;
 // start_obstacleTouchedTimer=false;
    
  //obstacleTouchedTimer=0;
 // if(exerciseTimeCounter==0)
 //   return;
    
  if (exerciseTimeCounter>0 && Number.isInteger(exerciseTimeCounter/7))
  {
    if(!start_detectingHeel)
      {
         // console.log('OK Start' + exerciseTimeCounter+' '+isRightSideStepping);
        //  text( 'OK Start One more time', widths / 2 - 20, 20);
        
        if(isRightSideStepping)                  // is the right side
          {
          //  startToSpeech('Take a right step side');
            startToSpeech('Step right');
            displayText='Step right!';
            isRightSideStepping=false;
          } 
        else                                      // is the left side
          { 
           // startToSpeech('Take a left step side'); 
       //     displayText='Take a left step side';
              startToSpeech('Step left'); 
              displayText='Step left!';
            isRightSideStepping=true;
          }
        
         if(rightHip!=null)
           {
//             beginingHeepPoint=rightHip.y;
               beginingHeepPoint=rightHip.x;
           }
        else
          {
           //  beginingHeepPoint=0;
             displayText='';
          }
        
          detectingHeelTimer=exerciseTimeCounter+4;
          start_detectingHeel=true;
       }
  }  
  
  else if (exerciseTimeCounter>=detectingHeelTimer && start_detectingHeel)
  {
    start_detectingHeel=false;
    
     if(isRightSideStepping)                  // is the right side
      {        
         if(rightHip!=null)
          {
      
    if((beginingHeepPoint+(beginingHeepPoint*0.04))<rightHip.x && rightHip.x <(beginingHeepPoint+(beginingHeepPoint*1.5)))
               {
         //console.log('Perfect');
        // text( 'Done', widths / 2 - 20, 20);
    //      displayText='*Done :'+beginingHeepPoint+'  '+rightHip.x+'  '+ (beginingHeepPoint-rightHip.x);
                 
                
       let ranText=floor( random(0, 7));
       if(ranText==0)
         { 
          displayText='Perfect, release';
          startToSpeech('Perfect release');
         }
        if(ranText==1)
          {
           displayText='Alright, release';
           startToSpeech('Alright release');
          }
        if(ranText==2)
          {
           displayText='Good, back';
           startToSpeech('Good, back');
          }
        if(ranText==3)
          {
           displayText='Good, back';
           startToSpeech('Good release');
          }
        if(ranText==4)
          {
            displayText='Fine, back';
            startToSpeech('Fine release');
          }
         if(ranText==5)
           {
             displayText='Great, release';
            startToSpeech('Great release');
           }
         if(ranText==6)
           {
             displayText='Great, release';
            startToSpeech('Great release');
           }
            
        exerciseNumbers++;
        scoreCounter++;
      }
    else
      {
       // console.log('Not');
        startToSpeech('Back one more time');
         displayText='Not'+beginingHeepPoint+'  '+rightHip.x+'  '+ (beginingHeepPoint-rightHip.x) ;
        displayText='One more time';

      }
    }
      }
    
    else                    // left side
    {
      if(rightHip!=null)
        {
                      if((beginingHeepPoint-(beginingHeepPoint*0.04))>rightHip.x && rightHip.x >(beginingHeepPoint-(beginingHeepPoint*1.5)))
      {
         //console.log('Perfect');
        // text( 'Done', widths / 2 - 20, 20);
       //    displayText='*Done :'+beginingHeepPoint+'  '+rightHip.x+'  '+ (beginingHeepPoint-rightHip.x) ;
        
       let ranText=floor( random(0, 7));
       if(ranText==0)
         { 
          displayText='Perfect, release';
          startToSpeech('Perfect release');
         }
        if(ranText==1)
          {
           displayText='Alright, release';
           startToSpeech('Alright release');
          }
        if(ranText==2)
          {
           displayText='Good, release';
           startToSpeech('Good release');
          }
        if(ranText==3)
          {
           displayText='Good, back';
           startToSpeech('Good release');
          }
        if(ranText==4)
          {
            displayText='Fine, release';
            startToSpeech('Fine release');
          }
         if(ranText==5)
           {
             displayText='Great, release';
            startToSpeech('Great release');
           }
         if(ranText==6)
           {
             displayText='Great, release';
            startToSpeech('Great release');
           }
     
        exerciseNumbers++;
        scoreCounter++;
      }
    else
      {
       // console.log('Not');
        startToSpeech('Release one more time');
      //  displayText='Not'+beginingHeepPoint+'  '+rightHip.x+'  '+ (beginingHeepPoint-rightHip.x) ;
        displayText='One more time';

      }
    }
    }
  }


  
      if(exerciseNumbers>=exerciseCounts)
          {
       text( 'Great work! You have successfully completed the Side Stepping exercise', widths / 2 - 220, 20);
        startToSpeech('Great work, You have successfully completed the Side Stepping exercise');
        //    speechTimer=100;
            stopTraining=true;
            start_exerciseTimeCounter=false; 
     //       speechRec.start();
            _divEndScreen.style('display', 'block');
            canvasInterface.style('display', 'none');
           }
  else
    {
               text( displayText, widths / 2 - 80, 20);

    }

}
 