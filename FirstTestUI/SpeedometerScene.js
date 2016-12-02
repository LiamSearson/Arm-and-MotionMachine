"use strict"; //This causes it to be executed in "strict" mode which prevents some unsafe syntax

function SpeedometerScene() {

  /////////////////////////////// BASIC SETUP ///////////////////////////////

  Scene.call(this); //Necessary for all custom scenes calls the default Scene constructor

  attrs = {size:25, leading:25};
  attrs1 = {size:50, leading:50}; //Redefining the size of text for smaller text fields

  //Setting maximum variables
  this.maxAngle = 1;

  //Creating the colorful "Mondrian" border and adding it to the scene
  this.bgBorder = new BackgroundBorder();
  this.addActor(this.bgBorder);

  //Creating and adding the HomeButton and giving it the homeAction defined in sketch.js
  this.homeButton = new HomeButton(this.homeActionArmFromSpeedometer.bind(this));
  this.addActor(this.homeButton);

  //Creating and adding the title text
  this.title = new Label(windowWidth/2, windowHeight*0.16, "Speedometer", {size:70, leading:50});
  this.addActor(this.title);

  /////////////////////////////// BUTTONS /////////////////////////////////

  // Create custom buttons to add to scene using "Textbutton" constructor
  // function TextButton(x pos, y pos, width, height, bgColor, text, textattrs, action, shape, nudge) {

  this.moveButton = new TextButton(
                  windowWidth*0.2 + 400, // x position
									windowHeight*0.3 + 150, // y position
									300, // width of button
									150, // height of button
									BLUE, // color of button              //creates the 'move' button, which moves the arm
									"Move", // text on button             //to the selected position on the speedometer when pressed
									attrs1, // text attributes
									this.performMoveAction.bind(this), // action to call
									'rect'); // shape
  this.addActor(this.moveButton); // Adds button "actor" to the scene

	this.backButton = new TextButton(
                  windowWidth*0.2 + 800, // x position
									windowHeight*0.3 + 150, // y position
									300, // width of button
									150, // height of button              //creates a button which returns to the previous scene when pressed
									BLUE, // color of button
									"Back", // text on button
									attrs1, // text attributes
									this.goBackAction.bind(this), // action to call
									'rect'); // shape
  this.addActor(this.backButton); // Adds button "actor" to the scene


  var wheelSize = 350;
  this.location = new Speedometer(windowWidth*0.20 - wheelSize/2, windowHeight/2 - wheelSize/2,
     wheelSize, wheelSize, this.locationAction.bind(this), 0, 1, 135, 45);
  this.locationLabel = new Label(windowWidth*0.20, windowHeight/2 + 150, "Degrees: 0 ", attrs);
  this.addActor(this.location);
  this.addActor(this.locationLabel);                      //creates the speedometer object in this scene, as well as a label for the value of it

	this.location.displayAngle = 270;
  this.location.onChange(270);


  //////////////////////// SLIDER FIXED IMPLEMENTATION ////////////////////////

  // Creates custom slider buttons
  // function Slider(x pos, y pos, width, min value of slider, max value of slider, default value where the button starts, action) {
  /*var fixedSliderSize = windowWidth*0.5;
  this.fixedPositionSlider =  new Slider(
                           windowWidth*0.15, // x position
                           windowHeight*0.73, // y position
                           fixedSliderSize, // size of slider
                           0, // min value of slider
                           114, // max value of slider
                           0, // default value of slider
                            this.fixedChangePosition.bind(this)); // action to call on slider change
  this.fixedPositionSlider.sliderImage(logo); // "sliderImage" sets the image of the knob of the slider object
  this.addActor(this.fixedPositionSlider); // adds slider to scene


  // Label adds text to a scene
  // function Label(x pos, y pos, text, textattrs, width, height)
  this.fixedSlideLabel = new Label(
                       windowWidth*0.4, // x position
                       windowHeight*0.63, // y position
                       "Position\n\n\n0mm                                         200mm", // text
                       {size: windowWidth*0.03, leading: windowHeight*0.09}); // text attributes
  this.addActor(this.fixedSlideLabel); // adds text to scene

   ////////////////////// SLIDER DYNAMIC IMPLEMENTATION /////////////////////////////

  var dynamicSliderSize = windowWidth*0.5; // real values 0-->115 || scale values 0-->200 115/200 = 0.575
  this.dynamicPositionSlider =  new Slider(
                             windowWidth*0.15,
                             windowHeight*0.63,
                             dynamicSliderSize,
                             0,
                             114,
                             0,
                             this.dynamicChangePosition.bind(this));
  this.dynamicPositionSlider.sliderImage(logo);
  this.addActor(this.dynamicPositionSlider);*/


 ///////////////////////// LOADING SCENE IMPLEMENTATION ///////////////////////////////

  //Setting the event handler in manager for the finishedAction event on the tablet
  //All tablet events must be set up like this to link the Arduino call to the actual function
  manager.setEventHandler(ARM.tablet.events.finishedAction, this.finishedAction.bind(this));

  ////////////////////////////////// TIMEOUT SCENE /////////////////////////////////////

  // Time out scene for when no actions are done on a scene for a period of time
  // this.timeoutScene = "MenuScene"; // Transistions back to home scene if times out
  // this.timeoutObject = function() { return RESET(); }; // Resets positions of actuators before moving to home scene
  // this.timeoutTime = defaultTimeoutTime; change time in miliseconds
  // this.timeoutObject = null; function to call (reset function) when transistioning
  // this.timeoutObject = function() { return stairsOnAction(); }; b/c you dont want to call function - use anon funct
  console.log("Created ControlPanel");

}

_inherits(SpeedometerScene, Scene); // NECESSARY, DO NOT FORGET - PUT AT END OF CONSTRUCTOR

///////////////////////////////// BUTTON SUB FUNCTIONS //////////////////////////////////


// Turns on stairs
SpeedometerScene.prototype.locationAction = function(angle) {
  var newAngle = angle;
  this.maxAngle = 360;
  if (newAngle <= 405 && newAngle >= 135)
  {
    newAngle = (newAngle-135)*(this.maxAngle/270)*2;
  }
  if(newAngle < 0) newAngle = 0;                //this function determines the math involved to get the desired value for the speedometer

  newAngle = newAngle - this.maxAngle;
  var direction;
  if(newAngle < 0) direction = -1;
  else direction = 1;

  console.log("Setting location to " + newAngle + " degrees");

  newAngle = newAngle.toFixed(2);
  this.locationLabel.text =  "Degrees:" + newAngle;  //sends a value between -1 and 1, which the arduino can read, instead of the actual degree value
  this.moveToAngleAction(newAngle/360);

  //control speed of wheel

}

SpeedometerScene.prototype.goBackAction = function() {
  stage.transitionTo('ArmControlPanelScene', -1);
  this.location.displayAngle = 270;          //action to return to previous scene, resets speedometer to default position
  this.location.onChange(270);
  //stage.pause();
}

SpeedometerScene.prototype.moveToAngleAction = function(anglePosition) {
  anglePosition = Math.floor(anglePosition *= 100.0);
  console.log("Curret value of speedometer is " + anglePosition/100.0);   //sets the value called 'rotations' from the arm class to be the
  manager.change(ARM.master.values.rotations, anglePosition);             //corresponding position on the speedometer
  //stage.pause();
}

SpeedometerScene.prototype.performMoveAction = function()
{
  ARM.master.events.moveToPosition();           //the actual function called to move the arm motor based on the value of 'rotations'
  console.log("performing move");
}

SpeedometerScene.prototype.finishedAction = function(){
  stage.resume();
}

SpeedometerScene.prototype.homeActionArmFromSpeedometer = function(){
  stage.transitionTo('ChooseMachineScene', -1);
  ARM.master.events.resetArmPosition();
  this.location.displayAngle = 270;              //the action performed when the 'home' button is pressed, resets speedometer
  this.location.onChange(270);
}

// Moves Pusher to Fixed Slider Position
// ControlPanel.prototype.pusherMoveAction = function() {
//   stage.pause("Performing Move");
//   console.log("Curret value of slider is " + this.fixedPositionSlider.posVal); // console.log prints things out to console for trouble shooting / verification
//   manager.change(PERPETUALBALLEVENTTT.master.values.railPosition, this.fixedPositionSlider.posVal);
//   // Set timeout basically a delay (funciton to call, amount to delay by)
//   setTimeout(function(){
//     PERPETUALBALLEVENTTT.master.events.moveRail();
//   }, 100); // delay by 100mS
//
// }

// Changes the value "railPosition" on the arduino side in reaction to the slider changing
// ControlPanel.prototype.fixedChangePosition = function(slidePosition) {
//   console.log("Curret value of Fslider is " + slidePosition);
//   manager.change(PERPETUALBALLEVENTTT.master.values.railPosition, slidePosition);
//   //console.log("Curret value of the variable is " + PERPETUALBALLEVENTTT.master.values.railPosition);
//
// }
//
// // Changes the value "dynamicPosition" on the arduino side in reaction to the slider changing
// ControlPanel.prototype.dynamicChangePosition = function(dynamicSlidePosition) {
//   console.log("Curret value of Dslider is " + dynamicSlidePosition);
//   manager.change(PERPETUALBALLEVENTTT.master.values.dynamicPosition, dynamicSlidePosition);
//   //console.log("Curret value of the variable is " + PERPETUALBALLEVENTTT.master.values.dynamicPosition);
//
// }
//
// // Resets the machine back to default state: Everything off, pusher at home, etc
// ControlPanel.prototype.RESET = function() {
//   PERPETUALBALLEVENTTT.master.events.downRail();
//   PERPETUALBALLEVENTTT.master.events.lowerGate();
//   PERPETUALBALLEVENTTT.master.events.turnOffStairs();
// }
//
// //This happens when the tablet event finishedAction() is called by the Arduino
// //It simply resumes the scene
// ControlPanel.prototype.finishedAction = function() {
//   stage.resume();
// }
