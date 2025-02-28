import { run } from 'hardhat';

console.log("start verify");
export const verify = async (contractAddress: string, contract: string, args: any[]) => {
  log('Verifying contract...', 'title');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: contract
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already verified!');
    } else {
      console.log(e);
    }
  }
  log('', 'separator');
};

type LogType = 'text' | 'separator' | 'title';
export const log = (text: string, type: LogType = 'text'): void => {
  if (type === 'separator' || text === 'separator') {
    console.log('-'.repeat(50));
    return;
  }
  if (type === 'title') {
    console.log('\x1b[1m\x1b[48;2;34;34;34m%s\x1b[0m', text);

    return;
  }
  console.log(text);
};
