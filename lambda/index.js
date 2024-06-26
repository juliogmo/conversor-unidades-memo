const Alexa = require('ask-sdk-core');

// Conversion functions
function convertToImperial(value, unit) {
    let convertedValue;
    let convertedUnit;
    switch (unit) {
        case 'kilometers':
        case 'kilómetros':
            convertedValue = value * 0.621371;
            convertedUnit = unit === 'kilometers' ? 'miles' : 'millas';
            break;
        case 'meters':
        case 'metros':
            convertedValue = value * 3.28084;
            convertedUnit = unit === 'meters' ? 'feet' : 'pies';
            break;
        case 'centimeters':
        case 'centímetros':
            convertedValue = value * 0.393701;
            convertedUnit = unit === 'centimeters' ? 'inches' : 'pulgadas';
            break;
        case 'kilograms':
        case 'kilogramos':
            convertedValue = value * 2.20462;
            convertedUnit = unit === 'kilograms' ? 'pounds' : 'libras';
            break;
        case 'grams':
        case 'gramos':
            convertedValue = value * 0.035274;
            convertedUnit = unit === 'grams' ? 'ounces' : 'onzas';
            break;
        case 'liters':
        case 'litros':
            convertedValue = value * 0.264172;
            convertedUnit = unit === 'liters' ? 'gallons' : 'galones';
            break;
        default:
            return null;
    }
    return { value: convertedValue, unit: convertedUnit };
}

function convertToMetric(value, unit) {
    let convertedValue;
    let convertedUnit;
    switch (unit) {
        case 'miles':
        case 'millas':
            convertedValue = value / 0.621371;
            convertedUnit = unit === 'miles' ? 'kilometers' : 'kilómetros';
            break;
        case 'feet':
        case 'pies':
            convertedValue = value / 3.28084;
            convertedUnit = unit === 'feet' ? 'meters' : 'metros';
            break;
        case 'inches':
        case 'pulgadas':
            convertedValue = value / 0.393701;
            convertedUnit = unit === 'inches' ? 'centimeters' : 'centímetros';
            break;
        case 'pounds':
        case 'libras':
            convertedValue = value / 2.20462;
            convertedUnit = unit === 'pounds' ? 'kilograms' : 'kilogramos';
            break;
        case 'ounces':
        case 'onzas':
            convertedValue = value / 0.035274;
            convertedUnit = unit === 'ounces' ? 'grams' : 'gramos';
            break;
        case 'gallons':
        case 'galones':
            convertedValue = value / 0.264172;
            convertedUnit = unit === 'gallons' ? 'liters' : 'litros';
            break;
        default:
            return null;
    }
    return { value: convertedValue, unit: convertedUnit };
}

// Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? '¡Bienvenido al conversor de unidades de Memito! Puedes pedirme convertir entre el sistema métrico decimal y el sistema inglés. Por ejemplo, di "Convierte 3 kilómetros a millas" o "Convierte 5 metros a pies".'
            : 'Welcome to the unit converter of Memito! You can ask to convert between the metric system and the imperial system. For example, say "Convert 3 kilometers to miles" or "Convert 5 meters to feet".';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const ConvertUnitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertUnitIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const value = parseFloat(slots.Value.value);
        const fromUnit = slots.FromUnit.value.toLowerCase();
        const toUnit = slots.ToUnit.value.toLowerCase();

        let result;
        if (['kilometers', 'meters', 'centimeters', 'kilograms', 'grams', 'liters', 'kilómetros', 'metros', 'centímetros', 'kilogramos', 'gramos', 'litros'].includes(fromUnit)) {
            result = convertToImperial(value, fromUnit);
        } else if (['miles', 'feet', 'inches', 'pounds', 'ounces', 'gallons', 'millas', 'pies', 'pulgadas', 'libras', 'onzas', 'galones'].includes(fromUnit)) {
            result = convertToMetric(value, fromUnit);
        } else {
            result = null;
        }

        let speakOutput;
        if (result) {
            speakOutput = locale.startsWith('es')
                ? `Conversor memo dice: ${value} ${fromUnit} son aproximadamente ${result.value.toFixed(2)} ${result.unit}. ¿Quieres hacer otra conversión?`
                : `Memo converter says:${value} ${fromUnit} are approximately ${result.value.toFixed(2)} ${result.unit}. Would you like to make another conversion?`;
        } else {
            speakOutput = locale.startsWith('es')
                ? 'Lo siento, Conversor memo no puede convertir esas unidades. ¿Te gustaría intentar otra conversión?'
                : 'Sorry, Memo converter can not convert those units. Would you like to try another conversion?';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? 'Conversor memo dice: Puedes pedirme que convierta unidades diciendo, "Convierte 5 kilómetros a millas".'
            : 'Memo converter says: You can ask me to convert units by saying, "Convert 5 kilometers to miles".';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? '¡Adiós!'
            : 'Goodbye!';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? 'Lo siento, Conversor memo no sabe eso. Puedes pedirme que convierta unidades diciendo, "Convierte 5 kilómetros a millas".'
            : 'Sorry, Memo converter does not know that. You can ask me to convert units by saying, "Convert 5 kilometers to miles".';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? `Acabas de activar ${intentName}`
            : `You just triggered ${intentName}`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const locale = handlerInput.requestEnvelope.request.locale;
        const speakOutput = locale.startsWith('es')
            ? 'Lo siento, conversor Memo tuvo problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.'
            : 'Sorry, Memo converter had trouble doing what you asked. Please try again.';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
     .addErrorHandlers(
        ErrorHandler
    )
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();