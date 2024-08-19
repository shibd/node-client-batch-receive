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

  console.log('consumer created');

  while (true) {
    const messages = await consumer.batchReceive();
    console.log(`Received ${messages.length} messages`);
    if (Math.floor(Math.random() * 100) < 3) {
      // io sleep();
      for (const msg of messages) {
        consumer.negativeAcknowledge(msg);
      }
      console.log(`Uacked ${messages.length} messages`);
    } else {
      // io sleep();
      for (const msg of messages) {
        consumer.acknowledge(msg);
      }
      console.log(`Acked ${messages.length} messages`);
    }
  }
}

main();
