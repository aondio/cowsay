/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

// returns true if the skill is running on a device with a display 
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}

const CowsayHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  
  handle(handlerInput) {
	const speechOutput = 'le mucche fanno mu, ma una fa mu mu';
	
		// device has display	
	 if (supportsDisplay(handlerInput) ) {

      const myImage = new Alexa.ImageHelper()
        .addImageInstance('https://c2.staticflickr.com/6/5536/9325662885_72ed559ba7_b.jpg')
        .getImage();

      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(speechOutput)
        .getTextContent();

      handlerInput.responseBuilder.addRenderTemplateDirective({
        type: 'BodyTemplate1',
        token: 'string',
        backButton: 'HIDDEN',
        backgroundImage: myImage,
        title: "Cowsay",
        textContent: primaryText,
      });

}
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .getResponse();
  },	

};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Mucca parlante';
const GET_FACT_MESSAGE = 'La mucca dice: ';
const HELP_MESSAGE = 'Chiedimi cosa dice la mucca';
const HELP_REPROMPT = 'Come posso aiutarti?';
const STOP_MESSAGE = 'A presto!';

const data = [
  'le mucche fanno mu, ma una fa mu mu'
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    CowsayHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
