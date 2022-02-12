const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
        .send({ from: accounts[0], gas: '1000000' })
})

describe('Inbox', () => {
    it('deploys a contact', () => {
        console.log(inbox.options.address);
        assert.ok(inbox.options.address);
    });

    it('has an initial value', async () => {
        assert.equal(await inbox.methods.message().call(), 'Hi there!');
    });

    it('accepts updates', async () => {
        await inbox.methods.setMessage('new message')
            .send({ from: accounts[0] });
        assert.equal(await inbox.methods.message().call(), 'new message');
    });
})