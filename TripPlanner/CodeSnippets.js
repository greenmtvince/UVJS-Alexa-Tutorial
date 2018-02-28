// 1 ======================================= Make sure we have our Entry Point Code
exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

 // 2 ========================================== Add some text Strings
 //    Modify these strings and messages to change the behavior of your Lambda function

 let speechOutput;
 let reprompt;
 const welcomeOutput =  "Let's plan a trip. Where would you like to go?";
 const welcomeReprompt = "Let me know where you'd like to go or when you'd like to go on your trip";
 const tripIntro = [
   "This sounds like a cool trip. ",
   "This will be fun. ",
   "Oh, I like this trip. "
 ];

 // 3 ==================================================== Modify the Launch Request
  this.response.speak(welcomeOutput).listen(welcomeReprompt);
this.emit(':responseReady');


// 4 =================================================== Add PlanMyTrip Intent
'PlanMyTrip': function () {

}

// 5 ============================================ Check to make sure we have all the required slots
//delegate to Alexa to collect all the required slot values
var filledSlots = delegateSlotCollection.call(this);

// Helper Function
function delegateSlotCollection(){
    console.log("in delegateSlotCollection");
    console.log("current dialogState: "+this.event.request.dialogState);
      if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
      } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
      } else {
        console.log("in completed");
        console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
      }
  }

// 6 =================================================== Insert Random Introductory Phrase to the response

//compose speechOutput that simply reads all the collected slot values
var speechOutput = randomPhrase(tripIntro);

//Helper Function
function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

// 7 ================================================== Recap the Trip from slots
//Now let's recap the trip
var fromCity=this.event.request.intent.slots.fromCity.value;
var toCity=this.event.request.intent.slots.toCity.value;
var travelDate=this.event.request.intent.slots.travelDate.value;
speechOutput+= " from "+ fromCity + " to "+ toCity+" on "+travelDate;

// 8 ================================================== Say the results
this.response.speak(speechOutput);
this.emit(":responseReady");

// 9 ================================================== Tidy up with a session Ended Request
'SessionEndedRequest': function () {
    var speechOutput = "";
    this.response.speak(speechOutput);
    this.emit(':responseReady');
},



