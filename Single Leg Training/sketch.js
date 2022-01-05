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
let chairPic2;

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
let speechTimer=100;
let speechTimeCounter=0;

let startClockTimer=false;
let clockCounter=0;
let clockCounterUI=0;

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
let leftHip=null;

// exercise timer
let exerciseNumbers=0;
let exerciseTime=15; // timer seconds
let exerciseTimeCounter=-1;
let lastExerciseTimeCounter=0;
let start_exerciseTimeCounter=false;

let obstacleTouchedTimer=0;
let start_obstacleTouchedTimer=false;
let obstacleTouchedWaitTime=8;

let waiting_Maxdetection=11;
let waiting_detection=0;
let waiting_detectionEnable=true;

let displayText='';
let displayTextSize=0;

var heights=500;
var widths=500;
var widthExtra=55;

var stopTraining=false;
var disableBullets=true;

 function preload() {
   
   //humanSkeleton = loadImage('Images/Body_Outline.png');
     humanSkeleton = loadImage('Images/body-outline-box.png');

   exercise1Pic=loadImage('Images/exercise3-selected.png');
   chairPic=loadImage('Images/chair.png');
   chairPic2=loadImage('Images/chair-2.png');
   //  shoulderExercisePic=loadImage('Images/single-leg-standing.jpg');

  // ballPic=loadImage('Images/ball_small.png');
   obstaclePic=loadImage('Images/rect-box.png');
   
   exercise1Button=createImg('Images/exercise1.png');
   exercise2Button=createImg('Images/exercise2.png');
   exercise3Button=createImg('Images/exercise3-selected.png');
   
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


  
  shoulderExercisePic=createImg('Images/one-single-leg-standing.gif');
  shoulderExercisePic.hide();
  

  humanOutlineSize=((heights*1.34)/humanSkeleton.height);

 obstaclePicSize=((heights*0.11)/obstaclePic.height);
  exercise1PicSize=((heights*0.075)/obstaclePic.height);
  chairSize=((heights*0.55)/chairPic.height);
  
  //0.25

  exerciseButtonSizeValue=((heights*0.23)/exercise2Button.height);

  sensitivityOutlineRange= (humanSkeleton.width*humanOutlineSize)/2;
  
   sensitivityOutlineRangeMin=  (humanSkeleton.width*humanOutlineSize)+ (humanSkeleton.width*humanOutlineSize)/10;
     sensitivityOutlineRangeMax=  (humanSkeleton.width*humanOutlineSize) + (humanSkeleton.width*humanOutlineSize)/1.2;

  lineSize=2.5;   // this sets the position of the red line for detecting the knees
  sensitivityKneeRangeMax=(lineSize+0.38)*(obstaclePic.height*obstaclePicSize);
  
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
 //speech.onEnd=restartspeech;
//speechRec.start(continuous,interim);

// once the record ends or an error happens, start() again. this should keep it going

  speechTimer=100;
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
 }

function restartspeechRec(){

	speechRec.start();
}

function restartspeech(){

	speech.cancel();
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
  exercise2Button.mousePressed(exercise2ButtonClicked);
  exercise1Button.mousePressed(exercise1ButtonClicked);

  exercise2Button.mouseOver(overMouseOnExercise2Buttons);
  exercise2Button.mouseOut(outMouseOnExercise2Buttons); 
  
  
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
    _divWelcome.html('Welcome to the Single Leg Standing Exercise<br><br><br><br><br>Please wait...', true);    
    _divWelcome.center();
    _divWelcome.style('font-size', exerciseFontFactor*3);  
    _divWelcome.style('color', 'white');
//    _divWelcome.style('border', '1px solid white');
    _divWelcome.style('text-align', 'center');
    _divWelcome.style('left', (windowWidth/ 2)-(_divWelcome.width)/3);
    _divWelcome.style('top', heights/2-(_divWelcome.height)/2);
  
   // _divWelcome.style('display', 'none');

    _divEndScreen = createDiv('').size((exercise1Button.width)*5, (exercise1Button.height)*0.7);
      
    _divEndScreen.html('Alright, You have successfully done the single-leg standing exercise.<br><br>Please say "repeat" or "next" to redo or go to the next exercise', true);       
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
  //console.log( 'gotSpeech');

//  if(speechRec.resultValue)
//  console.log(speechRec.resultString);
  
  
   if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('next'))
     {
        startToSpeech('Ok, The next exercise is selected');
        exercise1ButtonClicked();
     }
  
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('repeat'))
    {
      startToSpeech('Ok, The exercise is repeated');
      exercise3ButtonClicked();
    }
  
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('previous'))
      {
          startToSpeech('Ok. The previous exercise is selected');
          exercise2ButtonClicked();
      }
  
  /*
  if(speechRec.resultValue && speechRec.resultString.split(/\s+|\./).includes('redo'))
    {
       startToSpeech('Ok, The exercise is repeated');
       exercise1ButtonClicked();
    }
  */
}

function windowResized() 
{
  console.log("windowResized" ); 
  startToSpeech('It seems your web page has been resized. For better performance, please try to change the web page to full screen, and refresh the page again');

}
function overMouseOnExercise2Buttons()
{
   // exercise2Button.class('blur');
  exercise2Button.style('border', '2px solid yellow')
}
function outMouseOnExercise2Buttons()
{
   // exercise2Button.class('none');
    exercise2Button.style('border', '0px solid yellow')
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
function exercise2ButtonClicked()
{
//window.location.href = "http://www.google.com";
  window.location.href = "https://editor.p5js.org/Amirhossein/present/RAWFp47QB";
}
function exercise3ButtonClicked()
{
    window.location.href = "https://editor.p5js.org/Amirhossein/present/IV8YBltGX";
}
function exercise1ButtonClicked()
{
    window.location.href="https://editor.p5js.org/Amirhossein/present/kJd99Cl0M";
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
//  speechTimer=2;
 // speech.cancel();
  speechText = [];
}
function startToSpeech(text)
{
 //   console.log('draw 1');
  
    if(stopTraining)
     return;

   // console.log('draw 2');

  for (let i = 0; i < speechText.length; i++) 
    {
      if(speechText[i]==text)
        return null;
    }
   //   console.log('P0  '+text+' '+speechTimer);
    //  speech.setVoice('Google UK English Female'); //Google UK English
     speech.speak(text);
      speechText.push(text);
     //  speech.cancel();

/* if(speechTimeCounter>speechTimer)
    {
        speechText = [];
      speechTimeCounter=0;
    }
*/
  
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
 //  speechTimeCounter++;

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
  
  if(start_obstacleTouchedTimer)
    obstacleTouchedTimer++;
  
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
  //translate(widths-45 , 100);
  //rotate(-91);
  // let sc = second();

 // console.log(clockCounter);
  //strokeWeight(8);
 // stroke(255, 100, 150);
  //noFill();


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
    
//  rotate(-91);
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
//  let secondAngle = map(scoreCounter*26+0.001, 0, 10485, 0,360);
 
//    arc(0, 0, 70, 70, 0, secondAngle);
//    stroke(77, 175, 124,80);
 //   arc(0, 0, 70, 70, 0, 0);
  
  pop();
}


function detectingHumanOuatline() 
{

  
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
          text('Please rotate your body 90 degrees to the right like the training video!', widths / 2 - 300, 20);
        //  startToSpeech('It is optional, if you want, You can rotate your body 90 degree to the right like the training video');
          startToSpeech('Please rotate your body 90 degrees to the right like the training video');
        }
      // if(collectingDataTimer=>2 && collectingDataTimer<=3)
      //  text('Wait.. '+collectingDataTimer, widths/2-20,20);
      if (collectingDataTimer == 9 )
      {
        text('Are you ready?', widths / 2 - 20, 20);
        //startToSpeech('Are you ready?');
        collectingDataTimer = -2;
        startExercise = true;
        isInOutline = false;
      //  speechTimer=50;
        if(showTheGiftTimer>20) 
          {
            startClockTimer=true;
          //  clearSpeeches();
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
    
     // console.log("isInOutline " + isInOutline);

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
  
//    image(obstaclePic, widths / 2 -( (obstaclePic.width*obstaclePicSize)/2) , heights-((obstaclePic.height*obstaclePicSize)*obstaclePicYDisplay), obstaclePic.width * obstaclePicSize, obstaclePic.height * obstaclePicSize);
  
  
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
         
           if (keypoint.part == 'leftHip')
              {
                   leftHip  =keypoint.position;
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
      text('This is the single leg balance training', widths / 2 - 180, 20);
      startToSpeech('This is the single leg balance training');
    //  speechTimer=40;

    }
  if (showTheGiftTimer >= 4 && showTheGiftTimer<11)
    {
      text('Stand upright with your feet together and try to slowly lift your foot off the ground', widths / 2 - 350, 20);
      startToSpeech('Stand upright with your feet together, and try to slowly lift your foot off the ground');
    }
  if (showTheGiftTimer >= 11 && showTheGiftTimer<15)
    {
            text('You can also put your hands on the virtual chair you will see in front of you to help your balance', widths / 2 - 320, 20);      

     
      startToSpeech('You can also put your hands on the virtual chair you will see in front of you to help your balance, Alright, for this exercise, try to slowly lift your left leg and put it on the virtual box for 15 seconds');

      //startToSpeech('Alright, Stand your left leg for 15 seconds for improving your balance coordination');
    }
  if (showTheGiftTimer >= 15 && showTheGiftTimer<20)
    {
       text('Alright! try to slowly lift your left leg and put it on the virtual box for 15 seconds', widths / 2 - 340, 20);
     // startToSpeech('Try to put your lifted leg on the box for around 15 seconds! Perfect. Your training started!');
    //startToSpeech('');

    //  speechTimer=30;
    } 
  if (showTheGiftTimer == 20)
    { 
      shoulderExercisePic.hide();
      // shoulderExercisePic.hide();
      showTheGiftTimer=25;
      startClockTimer=true;
     // startToSpeech('If it is hard to stand your legs above the red line, you can rotate your camera 20 or 30 degrees towards down or you can use the box');
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
          
              if(exerciseNumbers==0) // it's left leg
                {
                   image(chairPic, widths-((chairPic.width*chairSize)) , heights-((chairPic.height*chairSize)), chairPic.width * chairSize, chairPic.height * chairSize);
                }
        else if(exerciseNumbers==1) // it's right leg
                {
                   image(chairPic2, ((chairPic2.width*chairSize)/10) , heights-((chairPic2.height*chairSize)), chairPic2.width * chairSize, chairPic2.height * chairSize);
                }
          
       image(obstaclePic, widths / 2 -( (obstaclePic.width*obstaclePicSize)/2) , heights-((obstaclePic.height*obstaclePicSize)*obstaclePicYDisplay), obstaclePic.width * obstaclePicSize, obstaclePic.height * obstaclePicSize);
          
      
          
          // draw hip line
 if(rightHip!=null)
              {
                
      stroke(123, 239, 178, 150);
      strokeWeight(10);
      line(25,rightHip.y,widths-25,rightHip.y);
 
              }
           
          //.......
          
          if(rightKnee==null && leftKnee==null )
            {
               if(rightshoulder!=null && rightElbow!=null && leftshoulder!=null  )
                {            
               //   scoreCounter++; 
                 /* 
      textSize(20);
      fill(255, 255, 185, 220);
      noStroke(0, 0, 0, 255);
      rect(0, 0, widths, 25);
      fill(0, 0, 0, 225);
      stroke(0,0,0,225);
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
    text('It seems your body and your knees are not in a good position!', widths / 2 - 270, 20);      
  //  startToSpeech('It seems your body and your knees are not in a good position');
                  
                }
            }
          
          else if(rightKnee!=null && leftKnee!=null )
            {
              
           // console.log(keypoint.position);
           // console.log('pic '+ (obstaclePic.widths-20));
            //370
         
            if(rightKnee.y> heights-(lineSize*(obstaclePic.height*obstaclePicSize)) && leftKnee.y> heights-(lineSize*(obstaclePic.height*obstaclePicSize)) )
              {
          //       console.log('position 0 called');
                 obstacleTouched(); 
              }
              else if(rightKnee.y< heights-(lineSize*(obstaclePic.height*obstaclePicSize)) || leftKnee.y< heights-(lineSize*(obstaclePic.height*obstaclePicSize)))
                {
                //    scoreCounter++; 
               //     exerciseCalculation();
            //        console.log('position 1 called');
                    start_exerciseTimeCounter=true;
                    start_obstacleTouchedTimer=false;
                    obstacleTouchedTimer=0;
           //       return;
                }
              else if(rightshoulder!=null && rightElbow!=null && leftshoulder!=null )
                {
              //    console.log('position 2 called');
                //  scoreCounter++; 
                //  exerciseCalculation();
                  
                    start_exerciseTimeCounter=true;
                    start_obstacleTouchedTimer=false;
                    obstacleTouchedTimer=0;
                  
               //   return;
                }
            }
          else if(rightKnee==null && leftKnee!=null)
            {
     //          if(leftKnee.y> height-(obstaclePic.height*obstaclePicSize))
    //          {
    //             obstacleTouched(); 
     //         }
      //        else
       //         {
              
     //         if(rightshoulder!=null && rightElbow!=null && leftshoulder!=null )
     //           {
     //             console.log('position 3 called');
     //            scoreCounter++; 
      //           exerciseCalculation();
       //         }
              
       //         }
            }
          else if(rightKnee!=null && leftKnee==null)
          {
         //    if(rightKnee.y> height-(obstaclePic.height*obstaclePicSize))
         //     {
          //       obstacleTouched(); 
         //     }
         //   else
         //     {
            
    //            if(rightshoulder!=null && rightElbow!=null && leftshoulder!=null )
     //           {
     //            console.log('position 4 called');

       //           scoreCounter++; 
       //           exerciseCalculation();
        //        }
            
         //     }
          }
          
            
       /*       if(leftHip!=null && rightHip!=null)
                {
                  if((leftHip.y-(rightHip.y *0.02))>rightHip.y && rightHip.y >(leftHip.y-(rightHip.y*0.22)) )
      {
        console.log('position *** called');
                  scoreCounter++; 
                  exerciseCalculation();
                }
                }
         */   
                    exerciseCalculation();

  //           if (startExercise && scorecal )
   //         {
   //         if(keypoint.part == 'rightElbow' ||keypoint.part == 'rightShoulder' || keypoint.part == 'rightKnee')            
    //      {
    //        scoreCounter++; 
    //      }
     //       }
  
          
  //****
          
//   if(frameCount %20 ==0 )
//    {
//      clockCounter++;  
//    }
// ***  
   /*       
    if (sourcePos != null) {
      if (targetPos != null) {


        textSize(20);
        fill(255, 255, 185, 220);
        noStroke(0, 0, 0, 255);
        rect(0, 0, widths, 25);
        fill(0, 0, 0, 225);
        stroke(225);


      //  console.log("*** current Line :" + ((targetPos.y - sourcePos.y) / (targetPos.x - sourcePos.x)));

      //  console.log("**** target Line :" + ((sourcePos.y - rangeMotionY) - (sourcePos.y)) / ((sourcePos.x - rangeMotionX) - sourcePos.x));

        //        if(((targetPos.y-sourcePos.y)/(targetPos.x-sourcePos.x))>= (rangeMotionY-sourcePos.y)/(rangeMotionX-sourcePos.x))
        if (((targetPos.y - sourcePos.y) / (targetPos.x - sourcePos.x)) >= ((sourcePos.y - rangeMotionY) - sourcePos.y) / ((sourcePos.x - rangeMotionX) - sourcePos.x))
        {
      //    console.log("********** Founded :");
       //   text('Great! One more time! Keep your arm here for 1 second and release it!', widths / 2 - 180, 20);
   //       startToSpeech('Great! One more time! Keep your arm here for 1 second and release it!');

        //  islineFounded=true;
        }
        else {
     //     console.log("*****Else***** sourcePos :");
     //     text('Put your right hand up and touch the red like', widths / 2 - 180, 20);
     //     startToSpeech('Put your right hand up and touch the red like');
     //     if(islineFounded)
     //     {
     //     rangeMotionX = random(70, 350); // range of motion
     //     rangeMotionY = 200; // lenght range motion
     //     }
    //      islineFounded=false;
      //  }
      }
    }*/
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

function obstacleTouched()
{
              //    console.log('Saay hello');
  //........................

  start_obstacleTouchedTimer=true;
  start_exerciseTimeCounter=false; // whenever exercise score calls it stops that and after a while set its score to 0

  //...........................
  
//tint(255, 50, 50, 255);                
  //  image(obstaclePic, widths / 2 - obstaclePic.height/2 , height-obstaclePic.height/2, obstaclePic.width * 0.5, obstaclePic.height * 0.5);
  
    image(obstaclePic, widths / 2 -( (obstaclePic.width*obstaclePicSize)/2) , heights-((obstaclePic.height*obstaclePicSize)*obstaclePicYDisplay), obstaclePic.width * obstaclePicSize, obstaclePic.height * obstaclePicSize);
                      
      stroke(246, 36, 89, 150);
      strokeWeight(10);
      fill(255, 50, 50, 255);

      line(25,heights-(lineSize*(obstaclePic.height*obstaclePicSize)),widths-25,heights-(lineSize*(obstaclePic.height*obstaclePicSize)));
 
                  
  
  if(obstacleTouchedTimer>obstacleTouchedWaitTime)
  {
   // console.log('obstacleTouched Timer');
    obstacleTouchedTimer=0;
    exerciseTimeCounter=-4;
   
   if(exerciseNumbers==0)
     {
       // it's the left excersice
     //  startToSpeech('Please stand your left leg above the red line beside the chair');
       displayText='Please lift your left leg above the red line and put in on the box';
       displayTextSize=280;
     }
    else if(exerciseNumbers==1)
      {
       // it's the right excersice
   //   startToSpeech('Please stand your right leg above the red line beside the chair');
      displayText='Please lift your right leg above the red line and put in on the box';
      displayTextSize=280;
      }
  }
}
 /* let ran=floor( random(0, 3));

  if(ran==0)
    {
      console.log('Hii 0');
      text('Oh you are toching the obstacle! Please stand one of your legs between red line and green line!', widths / 2 - 300, 20); 
      //startToSpeech('Oh you are toching the obstacle! Please stand one of your legs between red line and green line!');
      
    //  startToSpeech('Please try to stand your leg again! It seems your body and your knees are not in a good position!');

    }
  if(ran==1)
    {
       console.log('Hii 1');
       text('You move your body too much! Please stand one of your legs above the red line beside the chair!', widths / 2 - 250, 20);     
       //startToSpeech('You move your body too much! Please stand one of your legs above the red line beside the chair!');
    }
  if(ran==2)
    {
       console.log('Hiiee 2')
       text('Oh you are toching the obstacle! Please stand one of your legs between red line and green line!', widths / 2 - 250, 20);

 }*/
function drawSkeleton() 
{
if(disableBullets)
  return;
 // for (let i = 0; i < poses.length; i++) {
  if(pose!=null)
    {
    let skeleton = pose.skeleton;

    for (let j = 0; j < skeleton.length; j++) 
    {
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
  

  
   if(exerciseTimeCounter>=0)
     {
        if(exerciseTimeCounter==0 && lastExerciseTimeCounter!=exerciseTimeCounter )
          {
        //    console.log('[1] exerciseTimeCounter :' + exerciseTimeCounter);
          //  displayText='The position of your body and your legs are correct. Please try to keep this position';
           // startToSpeech('The position of your body and your legs are correct! Please try to keep this position for 15 seconds');
          displayText='Fine,try to keep this position for 15 seconds';
          displayTextSize=200;
     //     startToSpeech('Fine,try to keep this position for 15 seconds');
            lastExerciseTimeCounter=exerciseTimeCounter;
          }
         else if(exerciseTimeCounter<=exerciseTime && lastExerciseTimeCounter!=exerciseTimeCounter )
          {
            //    console.log('[<20] exerciseTimeCounter :' + exerciseTimeCounter);
                  displayText=exerciseTimeCounter;
                  displayTextSize=10;
               startToSpeech(exerciseTimeCounter);
            lastExerciseTimeCounter=exerciseTimeCounter;
          }
     }
    if(exerciseTimeCounter==(exerciseTime+1) && lastExerciseTimeCounter!=exerciseTimeCounter )
      {
         // console.log('[21] exerciseTimeCounter :' + exerciseTimeCounter);
        
        if(exerciseNumbers==0)
          {
     //      text( 'Great, You have done the left leg', widths / 2 - 300, 20);
           startToSpeech('Great, You have done the left leg, Please rotate your body 180 degree to the left and do again the same action with your right leg for 15 seconds');
            displayText='Great, You did it! You have successfully done the first exercise';
            displayTextSize=300;
            clearSpeeches();
          }
        if(exerciseNumbers==1)
          {
            // FINISHED 
            displayText='Great, You did it! You have successfully done the single leg standing exercise';
            displayTextSize=220;
            startToSpeech('Great, You did it, You have successfully done the single leg standing exercise');
          //  speechTimer=100;
            _divEndScreen.style('display', 'block');
            canvasInterface.style('display', 'none');
            

             start_exerciseTimeCounter=false;
             start_obstacleTouchedTimer=false;
             stopTraining=true;
           //  speechRec.start();
            // window.location.reload();
          }
        lastExerciseTimeCounter=exerciseTimeCounter;
        exerciseTimeCounter=-6;
        scoreCounter++;
        exerciseNumbers++;
        // exerciseTimeCounter++; // we add this because wewantto make sure this statement calls only one time
      }
  
    text( displayText, widths / 2 - displayTextSize, 20);

  // if(exerciseTimeCounter==(exerciseTime+4))
  //    {
  //       text( '', widths / 2 - 180, 20);
  //      startToSpeech('Ok, Please rotate your body 180 degree to the right and stand your other leg for 15 seconds!');
  //      console.log('[23] Finished exerciseTimeCounter :' + exerciseTimeCounter);
   //      exerciseTimeCounter=0;
   //   }

}
 