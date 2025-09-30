import dotenv from 'dotenv';
dotenv.config();

import { Client } from '@dootfoundation/client';

async function testL1() {
  console.log('=== Testing Mina L1 Method ===\n');

  const client = new Client(process.env.DOOT_API_KEY || '');

  console.log('1. Connecting to Mina L1 blockchain...');
  console.log('   (This will use cached compilation if L2 was tested first)\n');

  console.log('2. Fetching MINA price from L1...');
  try {
    const mina = await client.getFromL1('mina');
    const minaPrice = parseFloat(mina.price_data.price);
    console.log(`   ✅ MINA (L1): $${minaPrice.toFixed(6)}`);
    console.log(`   Source: ${mina.source}`);
    console.log(`   Contract: ${mina.price_data.oracle}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
    if (error instanceof Error && error.message.includes('OffchainState still settling')) {
      console.log('\n   ℹ️  This is the NEW error handling in action!');
      console.log('   The offchain state is currently settling on L1.');
      console.log('   This prevents the cryptic Field.assertEquals error.');
      console.log('   Try again in a few minutes after settlement completes.');
    }
  }

  console.log('\n3. Fetching Ethereum price from L1...');
  try {
    const ethereum = await client.getFromL1('ethereum');
    const ethPrice = parseFloat(ethereum.price_data.price);
    console.log(`   ✅ Ethereum (L1): $${ethPrice.toFixed(2)}`);
    console.log(`   Source: ${ethereum.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
    if (error instanceof Error && error.message.includes('OffchainState still settling')) {
      console.log('   ℹ️  Offchain state is settling - try again later');
    }
  }

  console.log('\n4. Fetching Bitcoin price from L1...');
  try {
    const bitcoin = await client.getFromL1('bitcoin');
    const btcPrice = parseFloat(bitcoin.price_data.price);
    console.log(`   ✅ Bitcoin (L1): $${btcPrice.toFixed(2)}`);
    console.log(`   Source: ${bitcoin.source}`);
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
    if (error instanceof Error && error.message.includes('OffchainState still settling')) {
      console.log('   ℹ️  Offchain state is settling - try again later');
    }
  }

  console.log('\n=== L1 Test Complete ===');
  console.log('\nNote: If you see "OffchainState still settling" messages,');
  console.log('this demonstrates the NEW error handling that provides');
  console.log('user-friendly feedback instead of cryptic errors.');
}

testL1().catch(console.error);