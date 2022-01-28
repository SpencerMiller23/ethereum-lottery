# Ethereum Lottery

## Overview

This project is a blockchain-based lottery which allows users to enter by paying the entry fee of $50 USD. The winner is determined by obtaining a verifiably random number from a Chainlink oracle, and paying out the contract balance to the corresponding user. The purpose of this project is to gain experience with powerful tools such as [Hardhat](https://hardhat.org/), [Chainlink](https://chain.link/) and [OpenZeppelin](https://openzeppelin.com/).

## Setup

1) Clone the repository
2) Run `npm run setup`
3) Create a `secrets.json` file with the following contents:
    {
        "alchemyMainnetUrl": "",
        "alchemyRinkebyUrl": "",
        "rinkebySecretKey": ""
    }

## Deploying locally

1) Open a terminal window and run `npx hardhat node`
2) Open a second terminal window
2) Run `npx hardhat run scripts/deploy.js --network localhost`
3) Note the addresses of the Lottery and LinkToken contracts

## Testing

- Unit test: run `npx hardhat test`
- Integration test: run `npx hardhat run test/test_lottery_integration --network rinkeby`

## Tasks

1) Run `npx hardhat startLottery <Lottery address> --network localhost`
2) Run `npx hardhat enterLottery <Lottery address> --network localhost`
3) Run `npx hardhat fundWithLink <Lottery address> <LinkToken address> --network localhost`
4) Run `npx hardhat endLottery <Lottery address> --network localhost`