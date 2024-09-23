const Pulsar = require('pulsar-client');

async function main() {

  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
  });

  Pulsar.Client.setLogHandler((level, file, line, message) => {
    console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
  });

  const consumer = await client.subscribe({
    subscription: 'test-sub',
    subscriptionType: 'Shared',
    topic: 'persistent://public/default/batch-receive4',
    batchReceivePolicy: {
      timeoutMs: 60000,
      maxNumMessages: 200,
      maxNumBytes: -1
    },
    receiverQueueSize: 30000
  });

  // Set to store processed messageIds
  const processedMessageIds = new Set();

  while (true) {
    console.info('Start call batch receive');
    const messages = await consumer.batchReceive();
    console.info(`Received ${messages.length} messages`);

    for (const msg of messages) {
      const messageId = msg.getMessageId().toString();
      console.log(`Received message: ${messageId}`);

      if (Math.floor(Math.random() * 100) < 50) {
        await consumer.acknowledge(msg);
        console.info(`Acknowledge ${messageId} messages`);
      } else {
        await consumer.negativeAcknowledge(msg);
        console.info(`Nack acknowledge ${messageId} messages`);
        continue
      }

      if (processedMessageIds.has(messageId)) {
        console.warn(`Received duplicate messageId: ${messageId}`);
      } else {
        processedMessageIds.add(messageId);
      }
    }
    await wait(2000);
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
