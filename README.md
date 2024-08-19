## 1. Step up pulsar 
docker compose up

## 2. Run consumer
(open two new shell)
```shell
docker exec -ti batch-receive pm2-runtime batch_receive.js
docker exec -ti batch-receive2 pm2-runtime batch_receive.js
```

## 3. Run producer
```shell
docker exec -ti batch-receive pm2-runtime batch_receive.js
```