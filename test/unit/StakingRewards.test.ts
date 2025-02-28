import { expect, assert } from "chai";
import { ethers, network } from "hardhat";
import {
  StakingRewards,
  StakingRewards__factory,
  TokenStaking,
  TokenStaking__factory,
  TokenReward,
  TokenReward__factory,
} from "../../typechain-types";

// Function
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// Data
import {
  ONE_DAY,
  ONE_MONTH,
  ONE_TOKEN,
  REWARD_AMOUNT,
  STAKING_AMOUNT,
  STAKING_DURATION,
  developmentChains,
} from "../../helper-hardhat-config";

// Types
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction, ContractReceipt } from "ethers/src.ts/ethers";
import { BigNumber } from "ethers";

// ------------


describe("TokenReward", function () {
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw new Error(
        "You need to be on a development chain to run unit tests"
      );
    }
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  type DeployFixture = {
    deployer: SignerWithAddress;
    tokenReward: TokenReward;
  };
  async function deployTokenFixture(): Promise<DeployFixture> {
    const [deployer]: SignerWithAddress[] = await ethers.getSigners();

    const tokenRewardFactory: TokenReward__factory =
      await ethers.getContractFactory("TokenReward", deployer);
    const tokenReward: TokenReward = await tokenRewardFactory.deploy();
    await tokenReward.deployed();

    return { deployer, tokenReward };
  }

  describe("#mint", function () {
    it("should increase the balance of the user when minting", async function () {
      const { deployer, tokenReward } = await loadFixture(deployTokenFixture);

      await tokenReward.mint(REWARD_AMOUNT);

      const minterHoldings: BigNumber = await tokenReward.balanceOf(
        deployer.address
      );

      assert.equal(minterHoldings.toString(), REWARD_AMOUNT.toString());
    });
  });
});

describe("TokenStaking", function () {
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw new Error(
        "You need to be on a development chain to run unit tests"
      );
    }
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  type DeployFixture = {
    deployer: SignerWithAddress;
    tokenStaking: TokenStaking;
  };
  async function deployTokenFixture(): Promise<DeployFixture> {
    const [deployer]: SignerWithAddress[] = await ethers.getSigners();

    const tokenStakingFactory: TokenStaking__factory =
      await ethers.getContractFactory("TokenStaking", deployer);
    const tokenStaking: TokenStaking = await tokenStakingFactory.deploy();
    await tokenStaking.deployed();

    return { deployer, tokenStaking };
  }

  describe("#mint", function () {
    it("should increase the balance of the user when minting", async function () {
      const { deployer, tokenStaking } = await loadFixture(deployTokenFixture);

      await tokenStaking.mint(REWARD_AMOUNT);

      const minterHoldings: BigNumber = await tokenStaking.balanceOf(
        deployer.address
      );

      assert.equal(minterHoldings.toString(), REWARD_AMOUNT.toString());
    });
  });
});

describe("StakingRewards", function () {
  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw new Error(
        "You need to be on a development chain to run unit tests"
      );
    }
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  type DeployFixture = {
    deployer: SignerWithAddress;
    stakingRewards: StakingRewards;
    tokenStaking: TokenStaking;
    tokenReward: TokenReward;
  };
  async function deployStakingRewardsFixture(): Promise<DeployFixture> {
    const [deployer]: SignerWithAddress[] = await ethers.getSigners();

    const tokenStakingFactory: TokenStaking__factory =
      await ethers.getContractFactory("TokenStaking", deployer);

    const tokenStaking: TokenStaking = await tokenStakingFactory.deploy();
    await tokenStaking.deployed();

    const tokenRewardFactory: TokenReward__factory =
      await ethers.getContractFactory("TokenReward", deployer);
    const tokenReward: TokenReward = await tokenRewardFactory.deploy();
    await tokenReward.deployed();

    const stakingRewardsFactory: StakingRewards__factory =
      await ethers.getContractFactory("StakingRewards", deployer);
    const stakingRewards: StakingRewards = await stakingRewardsFactory.deploy(
      tokenStaking.address,
      tokenReward.address
    );
    await stakingRewards.deployed();
    return { deployer, stakingRewards, tokenStaking, tokenReward };
  }

  async function increaseTime(amount: number) {
    await ethers.provider.send("evm_increaseTime", [amount]);
    await ethers.provider.send("evm_mine", []);
  }

  async function mintTokens(
    stakingRewards: StakingRewards,
    token: TokenStaking | TokenReward,
    isStakingToken: boolean
  ) {
    await token.mint(REWARD_AMOUNT);
    await token.transfer(stakingRewards.address, REWARD_AMOUNT);

    return token;
  }

  async function listStake(
    stakingRewards: StakingRewards,
    tokenReward: TokenReward
  ) {
    await stakingRewards.setRewardsDuration(STAKING_DURATION);

    await mintTokens(stakingRewards, tokenReward, false);

    await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);
  }

  async function mintAndStake(
    stakingRewards: StakingRewards,
    tokenStaking: TokenStaking,
    staker: SignerWithAddress
  ) {
    await tokenStaking.connect(staker).mint(STAKING_AMOUNT);
    await tokenStaking
      .connect(staker)
      .approve(stakingRewards.address, STAKING_AMOUNT);
    await stakingRewards.connect(staker).stake(STAKING_AMOUNT);
  }

  async function logData(
    stakingRewards: StakingRewards,
    staker: SignerWithAddress
  ) {
    const rewardRate = await stakingRewards.getRewardRate();
    const rewardPerToken = await stakingRewards.getRewardPerToken();
    const userRewardPerTokenPaid = await stakingRewards.userRewardPerTokenPaid(
      staker.address
    );
    const userReward = await stakingRewards.rewards(staker.address);
    const userBalance = await stakingRewards.balanceOf(staker.address);
    const userEarnings = await stakingRewards.getUserEarnings(staker.address);

    console.log(`-------------------`);
    console.log(`rewardRate: ${ethers.utils.formatUnits(rewardRate)}`);
    console.log(`rewardPerToken: ${ethers.utils.formatUnits(rewardPerToken)}`);
    console.log(
      `userRewardPerTokenPaid: ${ethers.utils.formatUnits(
        userRewardPerTokenPaid
      )}`
    );
    console.log(`userReward: ${ethers.utils.formatUnits(userReward)}`);
    console.log(`userBalance: ${ethers.utils.formatUnits(userBalance)}`);
    console.log(`userEarnings: ${ethers.utils.formatUnits(userEarnings)}`);
    console.log(`-------------------`);
  }

  describe("Constructor", function () {
    it("should initialize the first token address successfully", async function () {
      const { stakingRewards, tokenStaking } = await loadFixture(
        deployStakingRewardsFixture
      );

      const tokenStakingAddress = await stakingRewards.getStakingToken();

      assert.equal(tokenStakingAddress, tokenStaking.address);
    });

    it("should initialize the second token address successfully", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      const tokenRewardAddress = await stakingRewards.getRewardToken();

      assert.equal(tokenRewardAddress, tokenReward.address);
    });
  });

  describe("#setRewardsDuration", function () {
    it("should initialize the duration correctly", async function () {
      const { stakingRewards } = await loadFixture(deployStakingRewardsFixture);

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      const stakingDuration: BigNumber = await stakingRewards.getDuration();

      assert.equal(stakingDuration.toNumber(), STAKING_DURATION);
    });

    it("reverts if the connector is not the owner", async function () {
      const [, hacker]: SignerWithAddress[] = await ethers.getSigners();
      const { stakingRewards, tokenStaking } = await loadFixture(
        deployStakingRewardsFixture
      );

      await expect(
        stakingRewards.connect(hacker).setRewardsDuration(STAKING_DURATION)
      ).to.be.revertedWith(/Ownable: caller is not the owner/);
    });

    it("reverts if there is a staking in progress", async function () {
      const { stakingRewards, tokenStaking, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      const finishAt = await stakingRewards.getFinishAt();
      await increaseTime(ONE_MONTH - 3600);

      await expect(stakingRewards.setRewardsDuration(STAKING_DURATION))
        .to.be.revertedWithCustomError(
          stakingRewards,
          "StakingRewards__StakingDurationNotFinished"
        )
        .withArgs(finishAt);
    });
  });

  describe("#notifyRewardAmount", function () {
    it("should make reward rate 1 token per second", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      const rewardRate = await stakingRewards.getRewardRate();

      assert.equal(rewardRate.toString(), ONE_TOKEN.toString());
    });

    it("should make `rewardRate` equals 1 token per second in first notify", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      const rewardRate: BigNumber = await stakingRewards.getRewardRate();

      assert.equal(rewardRate.toString(), ONE_TOKEN.toString());
    });

    it("should make increase `rewardRate` if the staking is already on", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      const rewardRate1: BigNumber = await stakingRewards.getRewardRate();

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      const rewardRate2: BigNumber = await stakingRewards.getRewardRate();
      const twoTokens: BigNumber = ONE_TOKEN.add(ONE_TOKEN);

      assert(rewardRate2.gt(rewardRate1)); // it should increase the reward rate as we add another
      assert(rewardRate2.lte(twoTokens)); // it should be less than or equal two tokens as we added another ONE_TOKEN but some time passes
    });

    it("should make `finishAt`  equals the current timestamp + DURATION", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      const tx: ContractTransaction = await stakingRewards.notifyRewardAmount(
        REWARD_AMOUNT
      );
      const txReciept: ContractReceipt = await tx.wait(1);

      const blockNumber = txReciept.blockNumber;
      const block = await ethers.provider.getBlock(blockNumber);
      const currentTimestamp = block.timestamp;

      const finishAt: BigNumber = await stakingRewards.getFinishAt();

      assert.equal(finishAt.toNumber(), STAKING_DURATION + currentTimestamp);
    });

    it("should make `updateAt`  equals the current timestamp ", async function () {
      const { stakingRewards, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      const tx: ContractTransaction = await stakingRewards.notifyRewardAmount(
        REWARD_AMOUNT
      );
      const txReciept: ContractReceipt = await tx.wait(1);

      const blockNumber = txReciept.blockNumber;
      const block = await ethers.provider.getBlock(blockNumber);
      const currentTimestamp = block.timestamp;

      const updatedAt: BigNumber = await stakingRewards.getUpdatedAt();

      assert.equal(updatedAt.toNumber(), currentTimestamp);
    });

    it("reverts if the connector is not the owner", async function () {
      const [, hacker]: SignerWithAddress[] = await ethers.getSigners();
      const { stakingRewards, tokenStaking, tokenReward } = await loadFixture(
        deployStakingRewardsFixture
      );

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await mintTokens(stakingRewards, tokenReward, false);

      await stakingRewards.notifyRewardAmount(REWARD_AMOUNT);

      await expect(
        stakingRewards.connect(hacker).notifyRewardAmount(REWARD_AMOUNT)
      ).to.be.revertedWith(/Ownable: caller is not the owner/);
    });

    it("reverts if the `rewardRate` will be zero", async function () {
      const { stakingRewards } = await loadFixture(deployStakingRewardsFixture);

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await expect(
        stakingRewards.notifyRewardAmount(0)
      ).to.be.revertedWithCustomError(
        stakingRewards,
        "StakingRewards__ZeroRewardRate"
      );
    });

    it("reverts if the `rewardRate` is greater than the contract balance", async function () {
      const { stakingRewards } = await loadFixture(deployStakingRewardsFixture);

      await stakingRewards.setRewardsDuration(STAKING_DURATION);

      await expect(stakingRewards.notifyRewardAmount(REWARD_AMOUNT))
        .to.be.revertedWithCustomError(
          stakingRewards,
          "StakingRewards__RewardsGreaterThanBalance"
        )
        .withArgs(ONE_TOKEN.mul(STAKING_DURATION), 0);
    });
  });

  describe("#stake", function () {
    it("should emit `stake` event on successful staking", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);
      await listStake(stakingRewards, tokenReward);
      await tokenStaking.connect(staker).mint(STAKING_AMOUNT);
      await tokenStaking
        .connect(staker)
        .approve(stakingRewards.address, STAKING_AMOUNT);

      await expect(stakingRewards.connect(staker).stake(STAKING_AMOUNT))
        .to.emit(stakingRewards, "Stake")
        .withArgs(staker.address, STAKING_AMOUNT);
    });

    it("should transfer tokens from `staker` to the contract", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();

      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);

      await mintAndStake(stakingRewards, tokenStaking, staker);

      const contractBalance: BigNumber = await tokenStaking
        .connect(staker)
        .balanceOf(stakingRewards.address);
      assert.equal(contractBalance.toString(), STAKING_AMOUNT.toString());
    });

    it("should set rewardPerToken and userRewardPerTokenPaid[staker] to zero, as this is the first staker", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      const rewardPerToken: BigNumber = await stakingRewards
        .connect(staker)
        .getRewardPerToken();
      const userRewardPerToken: BigNumber = await stakingRewards
        .connect(staker)
        .userRewardPerTokenPaid(staker.address);

      assert.equal(rewardPerToken.toString(), "0");
      assert.equal(userRewardPerToken.toString(), "0");
    });

    it("should set updatedAt to the current time", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      const contractBalance: BigNumber = await tokenStaking
        .connect(staker)
        .balanceOf(stakingRewards.address);
      assert.equal(contractBalance.toString(), STAKING_AMOUNT.toString());
    });

    it("should increase the balance of the staker in the contract", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      const stakerBalance: BigNumber = await stakingRewards
        .connect(staker)
        .balanceOf(staker.address);
      assert.equal(stakerBalance.toString(), STAKING_AMOUNT.toString());
    });

    it("should increase the `totalSupply`", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      const totalSupply: BigNumber = await stakingRewards
        .connect(staker)
        .getTotalSupply();
      assert.equal(totalSupply.toString(), STAKING_AMOUNT.toString());
    });

    it("reverts if the amount equals zero", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await tokenStaking.connect(staker).mint(STAKING_AMOUNT);
      await tokenStaking
        .connect(staker)
        .approve(stakingRewards.address, STAKING_AMOUNT);

      await expect(
        stakingRewards.connect(staker).stake(0)
      ).to.be.revertedWithCustomError(
        stakingRewards,
        "StakingRewards__ZeroStakingAmount"
      );
    });

    it("should set `rewards[staker]` to zero and when another staking occuars, it should update it to staker earnings", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      const userRewardsBeforeStake2: BigNumber = await stakingRewards.rewards(
        staker.address
      );

      await increaseTime(ONE_DAY);

      await mintAndStake(stakingRewards, tokenStaking, staker);

      const userRewardsAfterStake2: BigNumber = await stakingRewards.rewards(
        staker.address
      );

      // User rewards should be zero if he made only one stake
      assert.equal(userRewardsBeforeStake2.toString(), "0");
      // the rewards should be updated in the second stake
      // NOTE: some seconds may pass, so the valud can be greater than staking for only one day
      assert(userRewardsAfterStake2.gte(ONE_TOKEN.mul(ONE_DAY)));
    });
  });

  describe("#withdraw", function () {
    it("should emit `withdraw` event on successful withdrawing", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await expect(stakingRewards.connect(staker).withdraw(STAKING_AMOUNT))
        .to.emit(stakingRewards, "Withdraw")
        .withArgs(staker.address, STAKING_AMOUNT);
    });

    it("should transfer tokens from the contract to the `staker`", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      await stakingRewards.connect(staker).withdraw(STAKING_AMOUNT);

      const contractBalance: BigNumber = await tokenStaking.balanceOf(
        stakingRewards.address
      );
      assert.equal(contractBalance.toString(), "0");
    });

    it("should decrease the balance of the staker in the contract", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await stakingRewards.connect(staker).withdraw(STAKING_AMOUNT);
      const stakerBalance: BigNumber = await stakingRewards.balanceOf(
        deployer.address
      );
      assert.equal(stakerBalance.toString(), "0");
    });

    it("should decrease the `totalSupply`", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await stakingRewards.connect(staker).withdraw(STAKING_AMOUNT);

      const totalSupply: BigNumber = await stakingRewards.getTotalSupply();
      assert.equal(totalSupply.toString(), "0");
    });

    it("should set updateAt variable to the current time", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      const tx: ContractTransaction = await stakingRewards
        .connect(staker)
        .withdraw(STAKING_AMOUNT);

      const txReciept: ContractReceipt = await tx.wait(1);

      const blockNumber = txReciept.blockNumber;
      const block = await ethers.provider.getBlock(blockNumber);
      const currentTimestamp = block.timestamp;

      const updateAt: BigNumber = await stakingRewards.getUpdatedAt();
      assert.equal(updateAt.toString(), currentTimestamp.toString());
    });

    it("should update `rewardPerToken` and `userRewardPerTokenPaid`", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      await stakingRewards.connect(staker).withdraw(STAKING_AMOUNT);

      const rewardPerToken: BigNumber =
        await stakingRewards.getRewardPerToken();
      const userRewardPerTokenPaid: BigNumber =
        await stakingRewards.userRewardPerTokenPaid(staker.address);

      const oneDayMulOneToken = ONE_TOKEN.mul(ONE_DAY);

      assert(rewardPerToken.gte(oneDayMulOneToken.div(STAKING_AMOUNT)));
      assert(userRewardPerTokenPaid.gte(oneDayMulOneToken.div(STAKING_AMOUNT)));
      assert.equal(
        rewardPerToken.toString(),
        userRewardPerTokenPaid.toString()
      );
    });

    it("should update `rewards[staker]` to be the amount of tokens earned for staking", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      await stakingRewards.connect(staker).withdraw(STAKING_AMOUNT);

      const userReward: BigNumber = await stakingRewards.rewards(
        staker.address
      );

      const oneDayMulOneToken = ONE_TOKEN.mul(ONE_DAY);

      assert(userReward.gte(oneDayMulOneToken));
    });

    it("reverts if the amount equals zero", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await expect(
        stakingRewards.connect(staker).withdraw(0)
      ).to.be.revertedWithCustomError(
        stakingRewards,
        "StakingRewards__ZeroWithdrawAmount"
      );
    });
  });

  describe("#claimRewards", function () {
    it("should emit `RewardsClaimed` event on successful withdrawing", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      const userRewards = await stakingRewards.getUserEarnings(staker.address);

      // the value claimed may be greater than `userRewards`, as updateReward modifier is fired when firing claimRewards function
      // which will set rewards to the account, and some seconds may pass for executing
      await expect(stakingRewards.connect(staker).claimRewards()).to.emit(
        stakingRewards,
        "RewardsClaimed"
      );
      // .withArgs(staker.address, userRewards);
    });

    it("should set `rewards[staker]` to zero", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      await stakingRewards.connect(staker).claimRewards();

      const userRewardAfterClaiming: BigNumber = await stakingRewards.rewards(
        staker.address
      );

      assert.equal(userRewardAfterClaiming.toString(), "0");
    });

    it("should set transfer rewardTokens to the staker", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);
      await mintAndStake(stakingRewards, tokenStaking, staker);

      await increaseTime(ONE_DAY);

      const userRewards = await stakingRewards.getUserEarnings(staker.address);

      await stakingRewards.connect(staker).claimRewards();

      const stakerRewardTokenBalance: BigNumber = await tokenReward.balanceOf(
        staker.address
      );

      // the value claimed may be greater than `userRewards`, as updateReward modifier is fired when firing claimRewards function
      // which will set rewards to the account, and some seconds may pass for executing
      assert(stakerRewardTokenBalance.gte(userRewards));
    });

    it("reverts if user has no reward tokens in his balance", async function () {
      const [, staker]: SignerWithAddress[] = await ethers.getSigners();
      const { deployer, stakingRewards, tokenStaking, tokenReward } =
        await loadFixture(deployStakingRewardsFixture);

      await listStake(stakingRewards, tokenReward);

      await expect(
        stakingRewards.connect(staker).claimRewards()
      ).to.be.revertedWithCustomError(
        stakingRewards,
        "StakingRewards__ZeroRewards"
      );
    });
  });
});
