import { spawn } from 'child_process';
import { config } from "dotenv";
import figlet from 'figlet';
import inquirer from 'inquirer';
import { getAccessToken } from './get-access-token';
import { getAPIGWInfo } from './get-info-gw';
import { createUser } from './signup-cognito-user';
config({path:".env.example"})

const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname,"..", '.serverless');
// Check if directory exists
const isDeployed =  () =>fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()

const runRemoveDeployment = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('npx', ['serverless','remove'], { stdio: 'pipe' });

    // Stream the standard output of the child process
    childProcess.stdout.on('data', (data) => {
      console.log(`Deployment: ${data.toString()}`);
    });

    // Stream the standard error of the child process
    childProcess.stderr.on('data', (data) => {
      console.error(`Deployment: ${data.toString()}`);
    });

    // When the process exits, resolve or reject the Promise
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);  // Resolve the promise if the process exits successfully
      } else {
        reject(new Error(`npm run test failed with exit code ${code}`)); // Reject if the process failed
      }
    });
  });
};

const runTests = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('npx', ['nx','run-many', '--target=test'], { stdio: 'pipe' });

    // Stream the standard output of the child process
    childProcess.stdout.on('data', (data) => {
      console.log(`Deployment: ${data.toString()}`);
    });

    // Stream the standard error of the child process
    childProcess.stderr.on('data', (data) => {
      console.error(`Deployment: ${data.toString()}`);
    });

    // When the process exits, resolve or reject the Promise
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);  // Resolve the promise if the process exits successfully
      } else {
        reject(new Error(`npm run test failed with exit code ${code}`)); // Reject if the process failed
      }
    });
  });
};

const runDeploy = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('npm', ['run', 'deploy'], { stdio: 'pipe' });

    // Stream the standard output of the child process
    childProcess.stdout.on('data', (data) => {
      console.log(`${data.toString()}`);
    });

    // Stream the standard error of the child process
    childProcess.stderr.on('data', (data) => {
      console.error(`${data.toString()}`);
    });

    // When the process exits, resolve or reject the Promise
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);  // Resolve the promise if the process exits successfully
      } else {
        reject(new Error(`npm run start failed with exit code ${code}`)); // Reject if the process failed
      }
    });
  });
};


const isValidEmail = (email:string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const validatePasswordByAWS = (password:string) => {
  // Check password length
  if (password.length < 8 || password.length > 128) {
    return 'Password debe ser entre 8 - 128';
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password debe contener una mayuscula.';
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password debe contener un minuscula';
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return 'Password debe contener un numero';
  }

  // Check for at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password debe contener un caracter especial';
  }

  return 'Password es valido';
};

const banner = ()=> new Promise<any>((res,rej)=>{
  figlet('Wizard del challenge!', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data);
    res(data)
  });
})


const mainMenu = async () => {

  await banner()
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '?',
      choices: ['Desplegar AWS', 'Destruir infra', 'Get info del apigateway',"Correr tests unitarios e integracion",'Crear usuario cognito para JWT', "Generar AccessToken",'Exit'],
    },
  ]);
  if( !["Desplegar AWS","Correr tests unitarios e integracion"].includes(answers.action) && !isDeployed()){
    console.log('Primero debes desplegar');
    return
  } 
  switch (answers.action) {
    case 'Desplegar AWS':
      await runDeploy()
      break;
    case 'Destruir infra':
        await runRemoveDeployment()
        break;
    case 'Get info del apigateway':
        const apiInfo = await getAPIGWInfo()
        console.log(`Endpoint: ${apiInfo.endpoint}`)
        console.log(`Apikey: ${apiInfo.apikey} //Recuerda que va en el header x-api-key`)
        console.info("Mas info ver el archivo openapi.yaml")
        console.warn("el endpoint POST /almacenar no necesita apikey")
        break;
    case "Correr tests unitarios e integracion":
      await runTests()
      break;
    case 'Crear usuario cognito para JWT':
      const input = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Entra nombre del usuario:',
          validate: (input) => !!input || 'es obligatorio',
        },
        {
          type: 'input',
          name: 'email',
          message: 'Entra email',
          validate: (input) => isValidEmail(input) || 'tipea un email correcto',
        },
        {
          type: 'input',
          name: 'password',
          message: 'Entra password',
          validate: (input) => validatePasswordByAWS(input) == 'Password es valido' || 'tipea un password correcto',
        },
      ]);
      await createUser(input.name.trim(),input.email.trim(),input.password.trim())
      break;
    case "Generar AccessToken":
      await getAccessToken()
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }

  mainMenu();
};

mainMenu()