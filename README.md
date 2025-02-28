### Prerequisites

You need to check if nodejs and npm are installed on your computer first.

```sh
npm --version
```

```sh
node --version
```


### Installation

Below is an example of how to start interacting with the smart contract locally.


1. Install NPM packages (remember to move to the directory `staking-rewards` first)
   ```sh
   npm install
   ```
2. Code installed successfully, you can start testing it.




<!-- USAGE EXAMPLES -->
## Usage

You can interact with the smart contract on the local network now.

- `npm run compile` to compile the solidity code
- `npm run deploy` to deploy the contract on the hardhat network
- `npm run deploy_sepolia` to deploy the contract on the sepolia network
- `npm run deploy_bsc_testnet` to deploy the contract on the bsc testnet network
- `npm run test` to run the unit testing of the contract


<!-- LICENSE -->

## TEST RESULT

# Contract on Sepolia
- `TokenStaking`: "0x4E3f8aBBed8980F3297691A814C2bE7357ddF5a1",
- `TokenReward`: "0x651d156A5a76e0b05150815950Dde7F639C734AE",
- `StakingRewards`: "0xf5FafE5EC910cBE462B977ed2A2B9BFc7f8740d3"

# Transactions
- `Mint TokenReward to Owner`: https://sepolia.etherscan.io/tx/0x2794554f71c5780eaaec37354858716b7c54f7b4320cb85b5b3e21e20dd5eca7

- `Tranfer RewardTokens to StakingRewards Contract`: http://sepolia.etherscan.io/tx/0xf94eed83b238cd6a7c196ec01692583a601aeb8525b6520a3fb62830dd92ff1e

- `Mint TokenStaking to Owner`: https://sepolia.etherscan.io/tx/0xbf7df6c25cbc9eff2f0df840f4ea3c3c141953fb98a79184bf01d70dc67afa15

- `Transfer Staking tokens to other staker`: https://sepolia.etherscan.io/tx/0x12976bd7b49845fe203c3e2c6dcb87f657bbaabfe4da54eee9cc4a8cfc38c7b3

- `Set Staking Duration as 5mins`: https://sepolia.etherscan.io/tx/0x34c6b9b513ec774c53d37bbddaba9d766c4b8970d0ae2b825514707f0c5246ab

- `Notify Staking Start or increasing reward amounts (this will determine _finishedAt)`: https://sepolia.etherscan.io/tx/0x6952c2e36e3b6378629634440bd5156e4a16f50a1b995b609a75b34024e9de5f

- `Approve staking amount of staker to StakingRewars Contract`: https://sepolia.etherscan.io/tx/0x17888d6e64d2c15166f2139c8bc40ab74ece0b93e7d5bdcd69fe3a1a2df161a5


- `Stake 1000 StakingTokens(first staker)`: https://sepolia.etherscan.io/tx/0x5e536438157a98238730e97f0cec3925113d917a581721afd14b6d6c59bf6a2b

- `Claim Rewards(first staker)`: https://sepolia.etherscan.io/tx/0xb2e6409577193d10b7bea27feb38e99f6831b70b9e9db553c366bf76fd323bd6

`Notify increasing reward amounts`: https://sepolia.etherscan.io/tx/0x8078345f0bdcf075ad15bbd99ed7495ce14c3f96a9949b6def6419edd27bbcba

- `Claim Rewards(first staker)`: https://sepolia.etherscan.io/tx/0x256b961cac5369d74568b6f297c6cb0cf0a7a006b77fd896932380700c2ad3f5

- `Set Staking Duration as 5mins`: https://sepolia.etherscan.io/tx/0xe1ad8d1b473fe942efcfc23c274a0b8836d04eee56621287e3fda74f6582cec9

- `Notify increasing reward amounts`: https://sepolia.etherscan.io/tx/0x978d5d548ee925c2043dddfb3bc6a616abda56504d69d0992937b4936f5d785d

- `Approve staking amount of staker to StakingRewars Contract`: https://sepolia.etherscan.io/tx/0x9fa4604e349d2112ed1b0444c978b20a3184eeb7563b3e7a596da27e03c3ca4d

- `Stake 500 StakingTokens(second staker)`: https://sepolia.etherscan.io/tx/0x47d29b923bc125136078452fb4e25e122ee8cfb96781cdab39292569b4205c88

- `Withdraw(first staker)`: https://sepolia.etherscan.io/tx/0x0d081a7cd133444dd0012619218667f5520cd63862d29e3004bf2ea1bd00f5c1,

- `Claim Rewards(first staker)`: https://sepolia.etherscan.io/tx/0xcdfac95ea8260240496d53ec048154ba2afc43e8763e3b80516573b57a6534d5

- `Withdraw(second staker)`: https://sepolia.etherscan.io/tx/0xa57c1988b3928cae314db171aecdfcf20acc36e7d2dca84491704bb945f7a0f3

Please check your "Transaction History" folder. You can see tokens pictures of staker wallets there.

## License

This project is under the MIT License. See `LICENSE` for more information.
