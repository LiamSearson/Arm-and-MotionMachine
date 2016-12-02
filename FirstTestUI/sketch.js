'use strict';


var floor = Math.floor;
var stage = new Stage();
var manager;
var attrs, attrs1;
// variables for scenes
var ConsoleOpeningScene, ConsoleInstructionScene, ChooseMachineScene, ArmDescriptionScene, MotionMachineDescriptionScene, ArmControlPanelScene,
    MotionMachineControlPanelScene, SpeedometerScene;     //initializes the names of each of the scenes that will be used

function preload() {
}


function setup() {

  MASTER = true;
  resizeCanvas(windowWidth, windowHeight);

  initMenuVariables();

  ConsoleOpeningScene = new ConsoleOpeningScene(openingSceneAction);
  stage.addScene('ConsoleOpeningScene', ConsoleOpeningScene);         //creates the opening scene with all of the artwork

  ConsoleInstructionScene = new ConsoleInstructionScene(continueInstructionAction);
  stage.addScene('ConsoleInstructionScene', ConsoleInstructionScene);       //creates the scene to show instructions for each button

  var machineButtonNames = ["Pneumatic Arm", "Motion Machine"];
  var machineButtonActions = [moveToArmDescriptionSceneAction, moveToMotionMachineDescriptionSceneAction];
  ChooseMachineScene = new ButtonsScene("Machines", null, machineButtonNames, machineButtonActions, homeAction, null);
  stage.addScene('ChooseMachineScene', ChooseMachineScene);          //creates the scene to select which machine you want to use

  var armStartButtonName = ["Start"];
  var armStartButtonAction = [moveToArmSceneAction];
  ArmDescriptionScene = new ButtonsScene("Description",
                                          "The Pneumatic Arm is a mechanism that uses stepper\n motors and electromagnets to move a ball.",
                                          armStartButtonName,
                                          armStartButtonAction,  //a description scene for the pneumatic arm
                                          homeActionArm,
                                          null);
  stage.addScene('ArmDescriptionScene', ArmDescriptionScene);

  var motionStartButtonName = ["Start"];
  var motionStartButtonAction = [moveToMotionMachineSceneAction];
  MotionMachineDescriptionScene = new ButtonsScene("Description",
                                          "The Perpetual Motion Machine is a mechanism that uses\n stepper motors, DC motors, and servos to move a ball.",
                                          motionStartButtonName,
                                          motionStartButtonAction,   //a description scene for the perpetual motion machine
                                          homeActionMotion,
                                          null);
  stage.addScene('MotionMachineDescriptionScene', MotionMachineDescriptionScene);

  var buttonNamesArm = ["Raise Arm", "Lower Arm", "Electromagnet On", "Electromagnet Off", "Move To Tall", "Move To Short"];
  var buttonActionsArm = [raiseArmAction, lowerArmAction, electromagnetOn, electromagnetOff, moveToTallFunction, moveToShortFunction];
  ArmControlPanelScene = new ButtonsScene("Control Panel",
                                      null,
                                      buttonNamesArm,
                                      buttonActionsArm,   //a control panel to be able to perform all the possible actions for the arm, with buttons for each
                                      homeActionArm,      //additionally, there is a button to move to the custom SpeedometerScene
                                      moveToSpeedometerScene);
  stage.addScene('ArmControlPanelScene', ArmControlPanelScene);

  var buttonNamesMotionMachine = ["Raise Lift", "Lower Lift", "Stairs On", "Stairs Off"];
  var buttonActionsMotionMachine = [raiseLiftAction, lowerLiftAction, stairsOnAction, stairsOffAction];
  MotionMachineControlPanelScene = new ButtonsScene("Control Panel",
                                      null,
                                      buttonNamesMotionMachine,   //another contorl panel scene, but for the perpetual motion machine, with all of its functions
                                      buttonActionsMotionMachine,
                                      homeActionMotion,
                                      null);
  stage.addScene('MotionMachineControlPanelScene', MotionMachineControlPanelScene);

  SpeedometerScene = new SpeedometerScene();
  stage.addScene('SpeedometerScene', SpeedometerScene);       //the creation of the custom SpeedometerScene, which includes the speedometer and several buttons

  stage.transitionTo('ConsoleOpeningScene');   //the final action of setup, which shows the opening scene when the program is run
}

function draw() {
  stage.draw();
}

function homeAction(){
  stage.transitionTo('ConsoleOpeningScene', -1);   //the action to return to the console opening scene from any generic scene
}

function homeActionMotion(){
  stage.transitionTo('ChooseMachineScene', -1);   //the action to return back to the choice of machines when the user is in the
  MOTIONMACHINE.master.events.setLiftToZero();    //perpetual motion machine state (section) of the UI; clicking this also resets the position of the lift on the machine
}

function homeActionArm(){
  stage.transitionTo('ChooseMachineScene', -1);  //similar to the above function, but when the user is in the pneumatic arm state. It also resets the position of the arm to 'home'
  ARM.master.events.resetArmPosition();
}

function openingSceneAction()
{
  console.log("moving to instruction scene");  //the action to move from the opening scene to the instructions scene
  stage.transitionTo('ConsoleInstructionScene');
}

function continueInstructionAction()
{
  console.log("moving to machines screen");  //the action to move from the instructions scene to the scene to choose which machine to use
  stage.transitionTo('ChooseMachineScene');
}

function moveToArmSceneAction()
{
  console.log("moving to arm control panel"); //the action to move from the description scene of the desired machine (arm in this case) to the control panel of
  stage.transitionTo('ArmControlPanelScene'); //that machine, it also resets the position of the arm before starting in case it is not at '0'
  ARM.master.events.resetArmPosition();
}

function moveToMotionMachineSceneAction()
{
  console.log("moving to motion machine control panel"); //same function as above, but for the perpetual motion machine. It also resets the position of the lift before starting
  stage.transitionTo('MotionMachineControlPanelScene');
  MOTIONMACHINE.master.events.setLiftToZero();
}

function moveToMotionMachineDescriptionSceneAction()
{
  console.log("moving to motion machine description");  //the action to move from the 'choice of machines' scene to the motion machine description scene. It also sets the 'state'
  stage.transitionTo('MotionMachineDescriptionScene');  //to be the MOTIONMACHINE state, so the hardware knows which events to perform
  manager.changeState(STATE_MOTIONMACHINE);
}

function moveToArmDescriptionSceneAction()
{
  console.log("moving to arm description");  //the same as above, it moves from the machine choice scene to the arm description scene, while setting the 'state' to the ARM state
  stage.transitionTo('ArmDescriptionScene');
  manager.changeState(STATE_ARM);
}

function raiseArmAction()
{
  console.log("Arm Raised");   //the action to raise the arm
  ARM.master.events.raiseArm();
}

function lowerArmAction()
{
  console.log("Arm Lowered");  //the action to lower the arm
  ARM.master.events.lowerArm();
}

function electromagnetOn()
{
  console.log("Electromagnet on");  //the action to enable to electromagnet
  ARM.master.events.enableElectromagnet();
}

function electromagnetOff()
{
  console.log("Electromagnet off");  //the action to disable the electromagnet
  ARM.master.events.disableElectromagnet();
}

function moveToTallFunction()
{
  console.log("Moving to tall tower"); //when called, it moves the arm to the defined position of the tallest tower
  ARM.master.events.moveToTall();
}

function moveToShortFunction()
{
  console.log("Moving to short tower");  //when called, it moves the arm to the defined position of the shortest tower
  ARM.master.events.moveToShort();
}

function raiseLiftAction()
{
  console.log("lift Raised");  //when called, it raises the lift of the motion machine to the predefined position at the top of the rail
  MOTIONMACHINE.master.events.moveLiftUp();
}

function lowerLiftAction()
{
  console.log("lift Lowered"); //when called, it lowers the lift of the motion machine the bottom of the rail, at position 0
  MOTIONMACHINE.master.events.moveToBottom();
}

function stairsOnAction()
{
  console.log("Stairs on");  //the action to turn on the stairs DC motor
  MOTIONMACHINE.master.events.runSteps();
}

function stairsOffAction()
{
  console.log("Stairs off");  //the action to turn off the stairs
  MOTIONMACHINE.master.events.stopSteps();
}

function moveToSpeedometerScene()
{
  stage.transitionTo('SpeedometerScene');  //moves from the arm control panel scene to the custom speedometer scene
  ARM.master.events.resetArmPosition();
}


// all these are needed to handle touch/mouse events properly
window.touchStarted = stage.touchStarted.bind(stage);
window.touchMoved = stage.touchMoved.bind(stage);
window.touchEnded = stage.touchEnded.bind(stage);
window.mousePressed = stage.mousePressed.bind(stage);
window.mouseDragged = stage.mouseDragged.bind(stage);
window.mouseReleased = stage.mouseReleased.bind(stage);
