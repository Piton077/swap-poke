import type { ExecutorContext } from '@nx/devkit';
import { exec } from 'child_process';

export interface EchoExecutorOptions {
  textToEcho: string;
}

export default async function echoExecutor(
  options: EchoExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  return new Promise<{ success: boolean }>((resolve) => {
    exec('npx cucumber-js', { cwd: context.root }, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      resolve({ success: !error });
    });
  });
}