import { APIGatewayClient, GetApiKeyCommand } from "@aws-sdk/client-api-gateway";
import { getServerlessOutput } from "./get-serverless-outputs";


// Usage

const client = new APIGatewayClient({
  region: 'us-east-1', // Specify your region
});

async function getApiKey(apikeyId:string) {
  try {
  
    const command = new GetApiKeyCommand({
      apiKey: apikeyId,
      includeValue: true, 
    });

    const response = await client.send(command);

    if (response.value) {
      return response.value
    } else {
      throw  new Error("No se encontro valor")
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error al recuperar valor del apikey")
  }
}




export async function getAPIGWInfo() {
  const data:any = await getServerlessOutput()
  const endpoint = `https://${data["api-gw"]["apiGatewayRestApiId"]}.execute-api.us-east-1.amazonaws.com/dev/api/v1`
  const apikey = await getApiKey(data["secure-api-gateway"]["apikey"])
  return {
    endpoint,
    apikey
  }
}

