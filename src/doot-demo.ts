import dotenv from 'dotenv';
dotenv.config();

import { Client, validtokens } from '@dootfoundation/client';

const client = new Client(process.env.DOOT_API_KEY || '');

console.log('Doot Oracle Client Demo\n');
console.log('='.repeat(50));

async function demonstrateAPI() {
  console.log('\n1. API Method Demo (Fastest ~100ms)');
  console.log('-'.repeat(30));

  try {
    const bitcoin = await client.getFromAPI('bitcoin');
    console.log('SUCCESS - Bitcoin from API:');
    console.log(`   Price: $${parseFloat(bitcoin.price_data.price).toFixed(2)}`);
    console.log(`   Source: ${bitcoin.source}`);
    console.log(`   Oracle: ${bitcoin.price_data.oracle}`);

    const ethereum = await client.getFromAPI('ethereum');
    console.log('SUCCESS - Ethereum from API:');
    console.log(`   Price: $${parseFloat(ethereum.price_data.price).toFixed(2)}`);
    console.log(`   Source: ${ethereum.source}`);

    // Calculate ratio
    const btcPrice = parseFloat(bitcoin.price_data.price);
    const ethPrice = parseFloat(ethereum.price_data.price);
    console.log(`   BTC/ETH ratio: ${(btcPrice / ethPrice).toFixed(4)}`);

  } catch (error) {
    console.log(`FAILED - API: ${error instanceof Error ? error.message : error}`);
  }
}

async function demonstrateL2() {
  console.log('\n2. Zeko L2 Method Demo (Fast ~10-30s)');
  console.log('-'.repeat(30));

  try {
    console.log('Connecting to Zeko L2 blockchain...');
    const solana = await client.getFromL2('solana');
    console.log('SUCCESS - Solana from L2:');
    console.log(`   Price: $${parseFloat(solana.price_data.price).toFixed(2)}`);
    console.log(`   Source: ${solana.source}`);
    console.log(`   Contract: ${solana.price_data.oracle}`);

  } catch (error) {
    console.log(`FAILED - L2: ${error instanceof Error ? error.message : error}`);
    console.log('   Note: L2 compilation takes time and may timeout in demo');
  }
}

async function demonstrateL1() {
  console.log('\n3. Mina L1 Method Demo (Secure ~30-60s)');
  console.log('-'.repeat(30));

  try {
    console.log('Connecting to Mina L1 blockchain...');
    const mina = await client.getFromL1('mina');
    console.log('SUCCESS - Mina from L1:');
    console.log(`   Price: $${parseFloat(mina.price_data.price).toFixed(2)}`);
    console.log(`   Source: ${mina.source}`);
    console.log(`   Contract: ${mina.price_data.oracle}`);

  } catch (error) {
    console.log(`FAILED - L1: ${error instanceof Error ? error.message : error}`);
    console.log('   Note: L1 compilation takes time and may timeout in demo');
  }
}

async function demonstrateFallback() {
  console.log('\n4. Smart Fallback Demo (API -> L2 -> L1)');
  console.log('-'.repeat(30));

  // Test with valid API key (should use API)
  console.log('Testing with valid API key...');
  try {
    const cardano = await client.getData('cardano');
    console.log(`SUCCESS - Cardano via fallback: $${parseFloat(cardano.price_data.price).toFixed(2)} (${cardano.source})`);
  } catch (error) {
    console.log(`FAILED - Fallback: ${error instanceof Error ? error.message : error}`);
  }

  // Test with invalid API key (should fallback to L2/L1)
  console.log('\nTesting fallback with invalid key...');
  const invalidClient = new Client('invalid-key-demo');
  try {
    const polygon = await invalidClient.getData('polygon');
    console.log(`SUCCESS - Polygon via fallback: $${parseFloat(polygon.price_data.price).toFixed(2)} (${polygon.source})`);
  } catch (error) {
    console.log(`FAILED - Full fallback: ${error instanceof Error ? error.message : error}`);
    console.log('   This is expected in demo due to compilation timeouts');
  }
}

async function demonstrateMultipleTokens() {
  console.log('\n5. Multiple Tokens Demo');
  console.log('-'.repeat(30));

  const tokens = ['bitcoin', 'ethereum', 'chainlink'];
  console.log(`Fetching prices for: ${tokens.join(', ')}`);

  for (const token of tokens) {
    try {
      const result = await client.getFromAPI(token);
      const price = parseFloat(result.price_data.price).toFixed(2);
      console.log(`   ${token.toUpperCase()}: $${price}`);
    } catch (error) {
      console.log(`   ${token.toUpperCase()}: Failed to fetch`);
    }
  }
}

async function demonstrateKeyValidation() {
  console.log('\n6. API Key Validation Demo');
  console.log('-'.repeat(30));

  const isValid = await client.isKeyValid();
  console.log(`API Key Status: ${isValid ? 'Valid' : 'Invalid'}`);

  if (!isValid) {
    console.log('Get a free API key at: https://doot.foundation/dashboard');
  }
}

async function runDemo() {
  console.log(`Supported tokens: ${validtokens.join(', ')}`);
  console.log(`API Key loaded: ${process.env.DOOT_API_KEY ? 'YES' : 'NO'}`);

  // Run demonstrations
  await demonstrateKeyValidation();
  await demonstrateAPI();

  // Note: L2 and L1 demos are commented out as they take long to compile
  // Uncomment to test blockchain methods (requires patience!)
  // await demonstrateL2();
  // await demonstrateL1();

  await demonstrateFallback();
  await demonstrateMultipleTokens();

  console.log('\n' + '='.repeat(50));
  console.log('Demo completed!');
  console.log('\nKey takeaways:');
  console.log('• API method is fastest for production apps');
  console.log('• L2/L1 methods provide decentralized fallback');
  console.log('• Smart fallback ensures maximum reliability');
  console.log('• All methods return identical data structure');
  console.log('\nNext steps:');
  console.log('• Get API key: https://doot.foundation/dashboard');
  console.log('• Read docs: https://docs.doot.foundation');
  console.log('• Install: npm install @dootfoundation/client');
}

// Run the demo
runDemo().catch(console.error);