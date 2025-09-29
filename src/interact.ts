import dotenv from 'dotenv';
dotenv.config();

import {
  PrivateKey,
  Mina,
  AccountUpdate,
  PublicKey,
  Field,
  Signature,
} from 'o1js';

import { Swap } from './Swap.js';
import { Client, ClientResultObject } from '@dootfoundation/client';

const client = new Client(
  process.env.DOOT_API_KEY ? process.env.DOOT_API_KEY : ''
);

const mina: ClientResultObject = await client.getData('mina');
const ethereum: ClientResultObject = await client.getData('ethereum');

const priceM = Field.from(mina.price_data.price);
const signatureM = Signature.fromBase58(mina.price_data.signature);
const priceE = Field.from(ethereum.price_data.price);
const signatureE = Signature.fromBase58(ethereum.price_data.signature);

const oracle = PublicKey.fromBase58(mina.price_data.oracle);

const proofsEnabled = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: proofsEnabled });
Mina.setActiveInstance(Local);

const deployerPK = Local.testAccounts[0].key;
const deployer = deployerPK.toPublicKey();
const zkappPK = PrivateKey.random();
const zkapp = zkappPK.toPublicKey();

if (proofsEnabled) await Swap.compile();
const swap = new Swap(zkapp);

console.log('\nDeploying Swap...');

let txn = await Mina.transaction(deployer, async () => {
  AccountUpdate.fundNewAccount(deployer);
  await swap.deploy();
});

await txn.prove();
await txn.sign([zkappPK, deployerPK]).send();

console.log('\nInitial Prices On-Chain =========================');
console.log('Fields ->');
console.log('MINA / USD:', swap.minaPrice.get());
console.log('ETH / USD :', swap.ethereumPrice.get());
console.log('Strings ->');
console.log('MINA / USD:', swap.minaPrice.get().toString());
console.log('ETH / USD :', swap.ethereumPrice.get().toString());

txn = await Mina.transaction(deployer, async () => {
  await swap.updatePrices(priceE, signatureE, priceM, signatureM, oracle);
});
await txn.prove();
await txn.sign([deployerPK]).send();

console.log('\nUpdated Prices On-Chain =========================');
console.log('Fields ->');
console.log('MINA / USD:', swap.minaPrice.get());
console.log('ETH / USD :', swap.ethereumPrice.get());
console.log('Strings ->');
console.log('MINA / USD:', swap.minaPrice.get().toString());
console.log('ETH / USD :', swap.ethereumPrice.get().toString());

console.log('\nExchange Rates On-Chain =========================');
const onChainMinaPrice = swap.minaPrice.get().toString();
const onChainEthPrice = swap.ethereumPrice.get().toString();

const minaToEth = Field.from(
  (BigInt(onChainMinaPrice) * 10000000000n) / BigInt(onChainEthPrice)
);

const ethToMina = Field.from(
  (BigInt(onChainEthPrice) * 10000000000n) / BigInt(onChainMinaPrice)
);

txn = await Mina.transaction(deployer, async () => {
  await swap.setExchangeRates(minaToEth, ethToMina);
});
await txn.prove();
await txn.sign([deployerPK]).send();

console.log('Fields ->');
console.log('MINA / ETH:', swap.minaToEthExchange.get());
console.log('ETH / MINA :', swap.ethToMinaExchange.get());
console.log('Strings ->');
console.log('MINA / ETH:', swap.minaToEthExchange.get().toString());
console.log('ETH / MINA :', swap.ethToMinaExchange.get().toString());
console.log('Actual Exchange Rates(/10**10) ->');
console.log(
  'MINA / ETH :',
  Number(swap.minaToEthExchange.get().toString()) / 10000000000
);
console.log(
  'ETH / MINA :',
  Number(swap.ethToMinaExchange.get().toString()) / 10000000000
);
console.log('\n');
