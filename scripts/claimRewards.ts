import { ethers, network } from "hardhat";
import jsonContracts from "../deployed-contracts.json";
import { StakingRewards, TokenReward } from "../typechain-types";

import logContractData from "../utils/logContractData";
import { BigNumber } from "ethers";
// ---

/*
  Make new staking 
*/

async function listStake() {
  const [deployer, staker] = await ethers.getSigners();
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
    // Withdraw staking tokens
    await stakingRewards.connect(staker).claimRewards();

    const userRewardTokenBalance: BigNumber = await tokenReward.balanceOf(
      staker.address
    );
    console.log(`Staker reward token balance: ${userRewardTokenBalance}`);
    await logContractData(stakingRewards, staker);
  } catch (err) {
    console.log(err);
    console.log("----------------------");
    throw new Error(`Failed claim reward tokens`);
  }

  return stakingRewards;
}

listStake()
  .then((stakingRewards) => {
    console.log(`claimed rewards successfully`);
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
