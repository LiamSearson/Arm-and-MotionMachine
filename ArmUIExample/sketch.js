'use strict';


var floor = Math.floor;
var stage = new Stage();
// variables for scenes
var homeScreen, rotationControlScene, machineControlScene;
var manager;
var attrs;
var logo;

function preload() {
	logo = loadImage("/ArmUIExample/miles.png");
}




function setup() {
  resizeCanvas(windowWidth, windowHeight);

  initMenuVariables();
  
  var homeScreenButtonName = ["Arm", "Other One"];
  var homeScreenButtonAction = [firstButtonAction, secondButtonAction];
  homeScreen = new ButtonsScene("Machines!!!",
								"These machines do nothing!!",
								homeScreenButtonName,
								homeScreenButtonAction,
								null,
								null,
								null,
								{size:50, leading:50});
  stage.addScene('homeScreen', homeScreen)
  
  rotationControlScene = new rotationScene()
  stage.addScene('rotationControlScene', rotationControlScene);
  
  machineControlScene = new MotionMachineScene();
  stage.addScene('machineControlScene', machineControlScene);
   
  
  stage.transitionTo('homeScreen');
}

function draw() {
  stage.draw();
}

function homeAction(){
  stage.transitionTo('homeScreen');
  //    comm.pause();
}

function nextAction(){
  stage.transitionTo('homeScreen');
  //    comm.pause();
}

function moveToScene3(){
	console.log("Moving to scene 3");
	stage.transitionTo('rotationControlScene');
}

function moveToScene4(){
	stage.transitionTo('electromagnetControlScene');
}

function firstButtonAction()
{
  console.log("First button pressed");
  manager.changeState(ARM);
  ARM.master.events.resetArmPosition();
  stage.transitionTo('rotationControlScene');
}

function secondButtonAction()
{
  console.log("Second button pressed");
  manager.changeState(MOTIONMACHINE);
  stage.transitionTo('machineControlScene');
}





// all these are needed to handle touch/mouse events properly
window.touchStarted = stage.touchStarted.bind(stage);
window.touchMoved = stage.touchMoved.bind(stage);
window.touchEnded = stage.touchEnded.bind(stage);
window.mousePressed = stage.mousePressed.bind(stage);
window.mouseDragged = stage.mouseDragged.bind(stage);
window.mouseReleased = stage.mouseReleased.bind(stage);
