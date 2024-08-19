const Pulsar = require('pulsar-client');

async function main() {

  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://pulsar-service:6650',
  });

  Pulsar.Client.setLogHandler((level, file, line, message) => {
    console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
  });

  const consumer = await client.subscribe({
    subscription: 'test-sub',
    subscriptionType: 'Shared',
    topic: 'persistent://public/default/batch-receive',
    batchReceivePolicy: {
      timeoutMs: 60000,
      maxNumMessages: 6000,
      maxNumBytes: -1
    },
    receiverQueueSize: 30000
  });

  console.info('consumer created');
  while (true) {
    console.info(`Start call batch receive`);
    const messages = await consumer.batchReceive();
    console.info(`Received ${messages.length} messages`);
    if (Math.floor(Math.random() * 100) < 2) {
      await wait(2000);
      await Promise.all(messages.map(msg => consumer.negativeAcknowledge(msg)));
      console.info(`NegativeAcknowledge ${messages.length} messages`);
    } else {
      await wait(2000);
      await Promise.all(messages.map(msg => consumer.acknowledge(msg)));
      console.info(`Acknowledge ${messages.length} messages`);
    }
    await wait(15000);
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
