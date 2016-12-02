"use strict"; //This causes it to be executed in "strict" mode which prevents some unsafe syntax

function rotationScene() {
	
  /////////////////////////////// BASIC SETUP ///////////////////////////////
	
  Scene.call(this); //Necessary for all custom scenes calls the default Scene constructor
  
  attrs = {size:25, leading:25}; //Redefining the size of text for smaller text fields
  
  //Setting maximum variables
  this.maxDistance = 200;
  
  //Creating the colorful "Mondrian" border and adding it to the scene
  this.bgBorder = new BackgroundBorder();
  this.addActor(this.bgBorder);
  
  //Creating and adding the HomeButton and giving it the homeAction defined in sketch.js
  this.homeButton = new HomeButton(homeAction);
  this.addActor(this.homeButton);
  
  /*this.nextButton = new NextButton(moveToScene4);
  this.addActor(this.nextButton);*/
  
  //Creating and adding the title text
  this.title = new Label(windowWidth/2, windowHeight*0.16, "Full Control", {size:70, leading:50});
  this.addActor(this.title);
  
  /////////////////////////////// BUTTONS /////////////////////////////////
  
  // Create custom buttons to add to scene using "Textbutton" constructor
  // function TextButton(x pos, y pos, width, height, bgColor, text, textattrs, action, shape, nudge) {
  
  this.moveButton = new TextButton(
									windowWidth*0.8 - 100,
									windowHeight*0.5 - 100,
									200,
									100,
									BLUE,
									"MOVE",
									attrs,
									this.moveArm.bind(this),
									'rect'); 
  this.addActor(this.moveButton);
  
  this.upButton = new TextButton(
									windowWidth*0.125,
									windowHeight*0.5 + 100,
									200,
									100,
									BLUE,
									"Arm Up",
									attrs,
									this.moveArmUp.bind(this),
									'rect'); 
  this.addActor(this.upButton);
  
  this.downButton = new TextButton(
									windowWidth*0.325,
									windowHeight*0.5 + 100,
									200,
									100,
									BLUE,
									"Arm Down",
									attrs,
									this.moveArmDown.bind(this),
									'rect'); 
  this.addActor(this.downButton);
  
  this.magnetOn = new TextButton(
									windowWidth*0.525,
									windowHeight*0.5 + 100,
									200,
									100,
									BLUE,
									"Magnet On",
									attrs,
									this.turnElectromagnetOn.bind(this),
									'rect'); 
  this.addActor(this.magnetOn);
  
  this.magnetOff = new TextButton(
									windowWidth*0.725,
									windowHeight*0.5 + 100,
									200,
									100,
									BLUE,
									"Magnet Off",
									attrs,
									this.turnElectromagnetOff.bind(this),
									'rect'); 
  this.addActor(this.magnetOff);
  
  /////////////////////////////// LABELS /////////////////////////////////

  this.sliderLabel = new Label(windowWidth*0.15 + 35,
								windowHeight*0.5 - 200,
								"0",
								attrs,
								200,
								50);
  this.addActor(this.sliderLabel);
  
  //////////////////////// SLIDER FIXED IMPLEMENTATION ////////////////////////
  
  // Creates custom slider buttons
  // function Slider(x pos, y pos, width, min value of slider, max value of slider, default value where the button starts, action) {
  var fixedSliderSize = windowWidth*0.5; 
  this.fixedPositionSlider =  new Slider(
                           windowWidth*0.15, // x position
                           windowHeight*0.5 - 100, // y position
                           fixedSliderSize, // size of slider
                           0, // min value of slider
                           100, // max value of slider
                           0, // default value of slider
  this.fixedChangePosition.bind(this)); // action to call on slider change
  this.fixedPositionSlider.sliderImage(logo); // "sliderImage" sets the image of the knob of the slider object
  this.addActor(this.fixedPositionSlider); // adds slider to scene

 ///////////////////////// LOADING SCENE IMPLEMENTATION ///////////////////////////////
 
  //Setting the event handler in manager for the finishedAction event on the tablet
  //All tablet events must be set up like this to link the Arduino call to the actual function
  manager.setEventHandler(ARM.tablet.events.finishedAction, this.finishedAction.bind(this));
  
  ////////////////////////////////// TIMEOUT SCENE /////////////////////////////////////
  
  // Time out scene for when no actions are done on a scene for a period of time
  this.timeoutScene = "MenuScene"; // Transistions back to home scene if times out
  this.timeoutObject = function() { return RESET(); }; // Resets positions of actuators before moving to home scene
  // this.timeoutTime = defaultTimeoutTime; change time in miliseconds
  // this.timeoutObject = null; function to call (reset function) when transistioning
  // this.timeoutObject = function() { return stairsOnAction(); }; b/c you dont want to call function - use anon funct
  console.log("Created rotationScene");
	
}

_inherits(rotationScene, Scene); // NECESSARY, DO NOT FORGET - PUT AT END OF CONSTRUCTOR

///////////////////////////////// BUTTON SUB FUNCTIONS /////////////////////////////////


// Changes the value "railPosition" on the arduino side in reaction to the slider changing
rotationScene.prototype.fixedChangePosition = function(slidePosition) {
  console.log("Curret value of Fslider is " + slidePosition);
  manager.change(ARM.master.values.rotations, slidePosition);
  if(slidePosition/100 == 0.24)
  {
  	this.sliderLabel.text = slidePosition/100 + " rotations (Tall Tower)";
  }
  else if(slidePosition/100 == 0.41)
  {
  	this.sliderLabel.text = slidePosition/100 + " rotations (Short Tower)";
  }
  else{
  	this.sliderLabel.text = slidePosition/100 + " rotations";
  }
}

rotationScene.prototype.moveArm = function() {
  ARM.master.events.moveArm();
  //stage.pause();
}

rotationScene.prototype.moveArmUp = function() {
  ARM.master.events.raiseArm();
  //stage.pause();
}
rotationScene.prototype.moveArmDown = function() {
  ARM.master.events.lowerArm();
  //stage.pause();
}
rotationScene.prototype.turnElectromagnetOn = function() {
  ARM.master.events.enableElectromagnet();
  //stage.pause();
}
rotationScene.prototype.turnElectromagnetOff = function() {
  ARM.master.events.disableElectromagnet();
  //stage.pause();
}

//This happens when the tablet event finishedAction() is called by the Arduino
//It simply resumes the scene
rotationScene.prototype.finishedAction = function(){
  stage.resume();
}
