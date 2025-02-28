import { ethers, network } from "hardhat";
import jsonContracts from "../deployed-contracts.json";
import { StakingRewards, TokenStaking } from "../typechain-types";
import { STAKING_AMOUNT } from "../helper-hardhat-config";
import logContractData from "../utils/logContractData";

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

  const tokenStaking: TokenStaking = await ethers.getContractAt(
    "TokenStaking",
    contracts[networkName].TokenStaking,
    deployer
  );

  try {
    // Mint and approve stakeing tokens
    await tokenStaking.connect(staker).mint(STAKING_AMOUNT);
    await tokenStaking
      .connect(staker)
      .approve(stakingRewards.address, STAKING_AMOUNT);
    await stakingRewards.connect(staker).stake(STAKING_AMOUNT);

    await logContractData(stakingRewards, staker);
  } catch (err) {
    console.log(err);
    console.log("----------------------");
    throw new Error(`Failed to stake tokens`);
  }

  return stakingRewards;
}

listStake()
  .then((stakingRewards) => {
    console.log(`staked successfully`);
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
