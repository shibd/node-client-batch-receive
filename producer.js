/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const Pulsar = require('pulsar-client');

(async () => {
  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar://localhost:6650',
    operationTimeoutSeconds: 30,
  });

  Pulsar.Client.setLogHandler((level, file, line, message) => {
    console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
  });

  // Create a producer
  const producer = await client.createProducer({
    topic: 'persistent://public/default/batch-receive4',
    sendTimeoutMs: 30000,
    batchingEnabled: true,
    batchingMaxMessages: 100,
    blockIfQueueFull: true,
  });

  const generateLargeMessage = (sizeInMB) => {
    const sizeInBytes = sizeInMB * 1024;
    return 'A'.repeat(sizeInBytes);
  };

  const largeMessage = generateLargeMessage(1); // 生成1MB大小的消息

  // Send messages
  for (let i = 0; i < 6000; i += 1) {
    const msg = `my-message-${largeMessage}`;
    producer.send({
      data: Buffer.from(msg),
    });
    console.log(`Sent message: ${i}`);
  }
  await producer.flush();

  await producer.close();
  await client.close();
})();
