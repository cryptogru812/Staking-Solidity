import { network, run } from "hardhat";

import deployTokenStaking from "./deployTokenStaking";
import deployTokenReward from "./deployTokenReward";
import deployStakingRewards from "./deployStakingRewards";
import { log } from "../../helper-functions";
import { TokenStaking, TokenReward } from "../../typechain-types";

// ---------

async function main() {
  await run("compile");
  const chainId = network.config.chainId!;

  log(
    `Deploying into network ${network.name} with chainId: ${chainId}`,
    "title"
  );
  const tokenStaking: TokenStaking = await deployTokenStaking(chainId);
  log(`Deployed TokenStaking contract successfully`);
  log("", "separator");
  const tokenReward: TokenReward = await deployTokenReward(chainId);
  log(`Deployed TokenReward contract successfully`);
  log("", "separator");

  await deployStakingRewards(
    chainId,
    tokenStaking.address,
    tokenReward.address
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
