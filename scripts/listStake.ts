import { ethers, network } from "hardhat";
import jsonContracts from "../deployed-contracts.json";
import { StakingRewards, TokenReward } from "../typechain-types";
import { REWARD_AMOUNT, STAKING_DURATION } from "../helper-hardhat-config";
// ---

/*
  Make new staking 
*/

async function listStake() {
  const [deployer] = await ethers.getSigners();
  const networkName: string = network.name;
  const contracts = Object(jsonContracts);
  if (!contracts[networkName].StakingRewards) {
    throw new Error("Contract is not deployed yet");
  }
  if (networkName === "hardhat") {
    throw new Error("Can't run scripts to hardhat network deployed contract");
  }
  const stakingRewards: StakingRewards = await ethers.getContractAt(
    "StakingRewards",
    contracts[networkName].StakingRewards,
    deployer
  );

  const tokenReward: TokenReward = await ethers.getContractAt(
    "TokenReward",
    contracts[networkName].TokenReward,
    deployer
  );

  try {
    // Set staking dutation
    await stakingRewards.setRewardsDuration(STAKING_DURATION);

    await tokenReward.mint(REWARD_AMOUNT);
    await tokenReward.transfer(stakingRewards.address, REWARD_AMOUNT);

    // Set staking amount, to start staking
    await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);
  } catch (err) {
    console.log(err);
    console.log("----------------------");
    throw new Error(`Failed to list the stake`);
  }

  return stakingRewards;
}

listStake()
  .then((stakingRewards) => {
    console.log(`Staking listed successfully`);
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
