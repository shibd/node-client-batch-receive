Test Env:
- uname-m: x86_64
- lsb_release -a
```shell
  No LSB modules are available.
  Distributor ID: Ubuntu
  Description:    Ubuntu 22.04.4 LTS
  Release:        22.04
  Codename:       jammy
```
- ldd --version
```shell
ldd (Ubuntu GLIBC 2.35-0ubuntu3.8) 2.35
```

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