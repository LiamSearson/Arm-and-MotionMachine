#include <SpeedyStepper.h>
#include <RCServo.h>
#include "states.h"

namespace ARM{

const byte SHORT_SENSOR = 27;
const byte TALL_SENSOR = 26;
const byte ROTATION_SENSOR = 29;
const byte ELECTROMAGNET = 28;
SpeedyStepper rotationMotor;
RCServo electromagnet;
const byte AIR = 3;
bool moving = false;
//values::rotationPosition;

void setup() {
  pinMode(AIR, OUTPUT);
  rotationMotor.connectToPort(2);
  rotationMotor.setStepsPerRevolution(1600);
  rotationMotor.setSpeedInRevolutionsPerSecond(0.15);
  rotationMotor.setAccelerationInRevolutionsPerSecondPerSecond(1);
  rotationMotor.disableStepper();
  electromagnet.connectToPin(ELECTROMAGNET, 1000, 2000, 0.0);
  pinMode(SHORT_SENSOR, INPUT_PULLUP);
  pinMode(TALL_SENSOR, INPUT_PULLUP);
  pinMode(ROTATION_SENSOR, INPUT_PULLUP);
  events::resetArmPosition();   //initializes and connects all of the pins needed to the appropriate ports
}

void loop() {

 }

void events::moveFromTallToShort() //function to do the whole action of moving the ball from the tall tower to the short tower
{
    moving = true;
    rotationMotor.moveToPositionInRevolutions(0.24);
    events::lowerArm();
    events::enableElectromagnet();
    delay(1500);
    events::raiseArm();
    delay(1500);
    rotationMotor.moveToPositionInRevolutions(0.41);
    delay(1000);
    events::lowerArm();
    delay(1500);
    events::disableElectromagnet();
    delay(1500);
    events::raiseArm();
    delay(1500);
    rotationMotor.moveToPositionInRevolutions(0);
    delay(1500);
    moving = false;

}

void events::moveToPosition()  //moves to a position based on the value of 'rotations,' the value changed by the speedometer
{
  moving = true;
  rotationMotor.moveToPositionInRevolutions(rotations.value/100.0);
  moving = false;
}

// rotations.value
// rotations.changed

void events::moveFromShortToTall()  //function to do the whole action of moving the ball from the short tower to the tall tower
{
  moving = true;
  rotationMotor.moveToPositionInRevolutions(0.41);
  events::lowerArm();
  events::enableElectromagnet();
  delay(1500);
  events::raiseArm();
  delay(1500);
  rotationMotor.moveToPositionInRevolutions(0.24);
  delay(1000);
  events::lowerArm();
  delay(1500);
  events::disableElectromagnet();
  events::raiseArm();
  rotationMotor.moveToPositionInRevolutions(0);
  delay(1500);
  moving = false;
}

void events::moveToTall()  //performs the action of just moving to the tall tower
{
  moving = true;
  rotationMotor.moveToPositionInRevolutions(0.24);
  moving = false;
}

void events::moveToShort()  //performs the action of just moving to the short tower
{
  moving = true;
  rotationMotor.moveToPositionInRevolutions(0.41);
  moving = false;
}

void events::disableElectromagnet()  //disables the electromagnet by setting the servo position to 0
{
  electromagnet.setServoPosition(0);
}

void events::enableElectromagnet()  //enables the electromagnet by setting the servo position to -1
{
  electromagnet.setServoPosition(-1);
}

// void events::moveArm(){
//   rotationMotor.enableStepper();
//   float rot = rotations.value;
//   rotationMotor.setupMoveInRevolutions(rot/100);
//   while(!rotationMotor.motionComplete())
//   {
// 	  rotationMotor.processMovement();
//   }
//   //rotationMotor.processMovement();
// }

void events::lowerArm()  //lowers the arm
{
  digitalWrite(AIR, HIGH);
}

void events::raiseArm()  //raises the arm
{
  digitalWrite(AIR, LOW);
}

void events::resetArmPosition()  //resets the arm to the position of 0 (home)
{
  rotationMotor.enableStepper();
  rotationMotor.moveToHomeInRevolutions(-1, 0.15, 2, ROTATION_SENSOR);
}
}
