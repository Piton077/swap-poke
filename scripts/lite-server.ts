import express from 'express';
import http from 'http';
import open from 'open';
import { getServerlessOutput } from './get-serverless-outputs';



// Step 1: Open the browser for login
async function openLoginPage(): Promise<void> {
    const data: any = await getServerlessOutput()
    const clientId: string = data["api-gw"]["appClientId"]
    const loginUrl =`https://softtek-challenge-oauth-v1.auth.us-east-1.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${"http://localhost:3000/callback"}`;
    await open(loginUrl);
}


export const getCode = () => new Promise<string>((res1,rej1)=>{
    const app = express();
    const server = http.createServer(app);
    setTimeout(()=>{
        console.error("El codigo login ya expiro")
        rej1("expired")
        server.close(); 
    },200000)
    app.get('/callback', (req, res) => {
        const code = req.query.code as string;
        if (code) {
            res.send('Login exitoso!');
            server.close(); 
            res1(code)
        } else {
            res.send('Error: No code found in URL.');
            rej1("no code found in url")
        }
    });

    const port = 3000;
    server.listen(port, async () => {
        console.log(`Log In to Cognito`);
        await openLoginPage(); 
    });
}) 
