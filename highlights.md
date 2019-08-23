# Serverless Federation

## highlights

* two parts: the gateway and the individual services
* services can extend each other, so User query does not need to be defined in only one services
* gateway is probably not a good candidate for serverless since it needs to ping all other services on each startup