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
        topic: 'persistent://public/default/batch-receive6',
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
        const message = await consumer.receive();
        const messageId = message.getMessageId().toString();
        console.log(`Received message: ${messageId}: ${message.getData().toString()}`);

        if (message.getData().toString() === "my-message-59") {
            await consumer.negativeAcknowledge(message);
            console.info(`Nack acknowledge ${messageId} messages}`);
        } else {
            await consumer.acknowledge(message);
            console.info(`Acknowledge ${messageId} messages `);
        }

        if (processedMessageIds.has(messageId)) {
            console.warn(`Received duplicate messageId: ${messageId}`);
        } else {
            processedMessageIds.add(messageId);
        }
        await wait(10);
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();
