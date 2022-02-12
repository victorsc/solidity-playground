// deploy code will go here

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const path = require('path');
const fs = require('fs');

const mnemonicPath = path.resolve(__dirname, 'mnemonic.txt');
const mnemonic = fs.readFileSync(mnemonicPath, {encoding: 'utf-8'});
console.log('mnemonic', mnemonic);
const provider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/f4dfd5ed971f43a39586437e7bea2032');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' });

    console.log(result.options.address);

    provider.engine.stop();
};

deploy();