import dotenv from 'dotenv';
dotenv.config();

import { Client } from '@dootfoundation/client';

async function testAPI() {
  console.log('=== Testing API Method ===\n');

  const client = new Client(process.env.DOOT_API_KEY || '');

  // Check API key validity
  console.log('1. Validating API Key...');
  const isValid = await client.isKeyValid();
  console.log(`   API Key Status: ${isValid ? '✅ Valid' : '❌ Invalid'}`);

  if (!isValid) {
    console.log('\n⚠️  Invalid API key! Get one at: https://doot.foundation/dashboard');
    return;
  }

  console.log('\n2. Fetching Bitcoin price...');
  try {
    const bitcoin = await client.getFromAPI('bitcoin');
    const btcPrice = parseFloat(bitcoin.price_data.price);
    console.log(`   ✅ Bitcoin: $${btcPrice.toFixed(2)}`);
    console.log(`   Source: ${bitcoin.source}`);
    console.log(`   Oracle: ${bitcoin.price_data.oracle}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n3. Fetching Ethereum price...');
  try {
    const ethereum = await client.getFromAPI('ethereum');
    const ethPrice = parseFloat(ethereum.price_data.price);
    console.log(`   ✅ Ethereum: $${ethPrice.toFixed(2)}`);
    console.log(`   Source: ${ethereum.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n4. Fetching MINA price...');
  try {
    const mina = await client.getFromAPI('mina');
    const minaPrice = parseFloat(mina.price_data.price);
    console.log(`   ✅ MINA: $${minaPrice.toFixed(6)}`);
    console.log(`   Source: ${mina.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }

  console.log('\n=== API Test Complete ===');
}

testAPI().catch(console.error);