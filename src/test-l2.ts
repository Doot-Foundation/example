import dotenv from 'dotenv';
dotenv.config();

import { Client } from '@dootfoundation/client';

async function testL2() {
  console.log('=== Testing Zeko L2 Method ===\n');

  const client = new Client(process.env.DOOT_API_KEY || '');

  console.log('1. Connecting to Zeko L2 blockchain...');
  console.log('   (This will compile contracts on first run - may take 30-60s)\n');

  console.log('2. Fetching MINA price from L2...');
  try {
    const mina = await client.getFromL2('mina');
    const minaPrice = parseFloat(mina.price_data.price);
    console.log(`   ✅ MINA (L2): $${minaPrice.toFixed(6)}`);
    console.log(`   Source: ${mina.source}`);
    console.log(`   Contract: ${mina.price_data.oracle}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n3. Fetching Ethereum price from L2...');
  console.log('   (Using cached compilation - should be faster)\n');
  try {
    const ethereum = await client.getFromL2('ethereum');
    const ethPrice = parseFloat(ethereum.price_data.price);
    console.log(`   ✅ Ethereum (L2): $${ethPrice.toFixed(2)}`);
    console.log(`   Source: ${ethereum.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n4. Fetching Bitcoin price from L2...');
  try {
    const bitcoin = await client.getFromL2('bitcoin');
    const btcPrice = parseFloat(bitcoin.price_data.price);
    console.log(`   ✅ Bitcoin (L2): $${btcPrice.toFixed(2)}`);
    console.log(`   Source: ${bitcoin.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n=== L2 Test Complete ===');
}

testL2().catch(console.error);