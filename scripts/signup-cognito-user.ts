import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { getServerlessOutput } from "./get-serverless-outputs";

// Initialize AWS Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: "us-east-1" });


export const createUser = async (username: string, email: string, password: string): Promise<void> => {
  try {
    // 1️⃣ Create the Cognito user
    const data:any = await getServerlessOutput()
    const userPoolId = data["api-gw"]["appCognitoPoolId"]
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [{ Name: "email", Value: email }],
      MessageAction: "SUPPRESS",
    });

    await cognitoClient.send(createUserCommand);

    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    });

    await cognitoClient.send(setPasswordCommand);

    console.log("✅ User created successfully");
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
};