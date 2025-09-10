
type GenericAgentConfig = {
    systemPrompt: string,
    chainOfThought: string,
}

const schema = `{
   "type": "object",
   "properties": {
     "name": {
       "type": "string"
     },
     "lastName": {
       "type": "string"
     },
     "email": {
       "type": "string"
     },
     "phone": {
       "type": "string",
       "description": "Phone number is any number and can contain country codes too, +34 or any other."
     },
     "address":{
       "type": "object",
       "properties": {
         "city": {
           "type": "string"
         },
         "fullAddress":  {
           "type": "string"
         },
         "postal": {
           "type": "string"
         }
       },
       "required":["city", "fullAddress", "postal"]
     },
     "renovation":{
       "type":"object",
       "properties": {
         "type": {
           "type":"string",
           "description": "can be paintjob or floor-renovation"
         },
         "m2"{
           "type": "string",
           "description": "the aproximate number of square meters for the job"
         },
         "message":{
           "type":"string",
           "description":"What is the customer renovation about, color, type of floor or paint?"
         }
       }
     }
   },
   "required": ["name", "lastName", "email", "phone", "address"]
 }`;

 export const createExperimentalConfig = (messages: string[]):GenericAgentConfig => {
   const systemPrompt = `
You are assisting as a customer service agent for a home renovation business that offers painting and flooring renovation services. 
Your goal is to gather required information from the customer step by step to create a structured JSON object.
SCHEMA:
   - Follow the schema provided to know which fields are required and what type of data is expected.
   ${schema}
   - If all required fields are collected, you will respond ONLY with the completed JSON object.
   - If any required fields are missing, you will prompt the user to provide them step by step.

REPLIES:
   - If all required fields are collected, you will respond ONLY with the completed JSON object.
   - If any required fields are missing, you will prompt the user to provide them step by step.
   - Do not add extra text when the JSON object is ready. Respond strictly in JSON format.

CONVERSATION HISTORY:
${ messages.join("")}`
 
const chainOfThought = `To effectively extract customer dats, you will follow these requirements:

1. Extraction process:
   Communicate with the customer in a friendly and logical way following the rules of the conversation, u will request information in order.
   - Group 1: Ask for basic information (name, lastName).
   - Group 2: Ask for contact information (phone, email).
   - Group 3: Ask for address information (city, fullAddress, postal).
   - Group 4: Ask for work information (type, m2, message).

2. Asking for information:
   - Personalize the interaction by using the fields already provided.
   - Follow a logical and friendly progression based on the information missing.
   - Consider all properties of the json schema and any sub-property as required.
   - Have confidence in your decisions if the information is ready, complete your task

3. VALID Examples:

   - Some fields are missing:
   input: {"name": "Javier"}
   response: Hello Javier, can you provide me your last name?

   - All fields are ready:
   input: {"name": "Javier", "lastName": "Ribo", "email": "elribonazo@gmail.com", "phone": "123456789"}
   response:
   {"name": "Javier", "lastName": "Ribo", "email": "elribonazo@gmail.com", "phone": "123456789"}

4. INVALID Examples:
   - Avoid this kind of output when complete:
   input: {"name": "Javier", "lastName": "Ribo", "email": "elribonazo@gmail.com", "phone": "123456789"}
   reasoning: This response would be invalid because we must respond PURELY with JSON object, no extra text should be added.
   response:
   Great, thank you for providing all the required information. 
   Here's the JSON:
   {"name": "Javier", "lastName": "Ribo", "email": "elribonazo@gmail.com", "phone": "123456789"}
`;
   return {
    systemPrompt,
    chainOfThought
   }
 }
