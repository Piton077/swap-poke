import { exec } from "child_process";
import queryString from "query-string";
import { getServerlessOutput } from "./get-serverless-outputs";
import { getCode } from "./lite-server";


// Function to run the command and return the output as a promise
export function runServerlessOutputs() {
    return new Promise<string>((resolve, reject) => {
        exec('npx serverless outputs', (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing command: ${error.message}`);
                return;
            }

            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }

            // Resolve the promise with the output
            resolve(stdout);
        });
    });
}

// Usage


const removeAnsiCodes = (str: string) => {
    return str.replace(/\x1B\[[0-9;]*m/g, ''); // Regular expression to remove ANSI escape codes
};

export async function getAccessToken() {
    const code:string = await getCode()
    const {access_token} = await oathGetToken(code)
    console.log(`Access token: ${access_token} //Recuerda que solo dura una hora`)

}

const oathGetToken = async (code:string) => {
    const data: any = await getServerlessOutput()
    const clientId:string = data["api-gw"]["appClientId"]
    const url = `https://${process.env["COGNITO_DOMAIN"]}.auth.us-east-1.amazoncognito.com/oauth2/token`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'XSRF-TOKEN=3eaf16c4-cf95-4a1a-b827-9f81222ac789',
    };

    const body = queryString.stringify({
        grant_type: 'authorization_code',
        client_id:clientId,
        code,
        redirect_uri: 'http://localhost:3000/callback',
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
    })
        .then((response) => response.json())
        .catch((error) => console.error('Error:', error));
    return response
}



