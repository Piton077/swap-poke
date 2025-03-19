import { exec } from "child_process";
import { load } from "js-yaml";

 function runServerlessOutputs() {
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
const removeAnsiCodes = (str:string) => {
    return str.replace(/\x1B\[[0-9;]*m/g, ''); // Regular expression to remove ANSI escape codes
  };


export const getServerlessOutput = async ()=>{
    const content:string = await runServerlessOutputs()
    return load(removeAnsiCodes(content));
}