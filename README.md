# Botium Connector for Xatkit

[![NPM](https://nodei.co/npm/botium-connector-xatkit.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-connector-xatkit/)

This is a [Botium](https://github.com/codeforequity-at/botium-core) connector for testing your Xatkit chatbot.

## How it works?
This connector connects to the endpoint of Xatkit server.

It can be used as any other Botium connector with all Botium Stack components:
* [Botium CLI](https://github.com/codeforequity-at/botium-cli/)
* [Botium Bindings](https://github.com/codeforequity-at/botium-bindings/)
* [Botium Box](https://www.botium.at)

## Requirements

* __Node.js and NPM__
* a running __Xatkit bot__
* a __project directory__ on your workstation to hold test cases and Botium configuration

## Install Botium and Xatkit Connector

When using __Botium CLI__:

```
> npm install -g botium-cli
> npm install -g botium-connector-xatkit
> botium-cli init
> botium-cli run
```

When using __Botium Bindings__:

```
> npm install -g botium-bindings
> npm install -g botium-connector-xatkit
> botium-bindings init mocha
> npm install && npm run mocha
```

When using __Botium Box__:

TODO

## Connecting your Xatkit server to Botium

Create a botium.json with the URL of your Xatkit server in your project directory:


```
{
  "botium": {
    "Capabilities": {
      "PROJECTNAME": "Botium project Xatkit",
      "CONTAINERMODE": "xatkit",
      "XATKIT_SERVER_URL": "<URL of the Xatkit server>"
    }
  }
}
```

## Note
The `Client_Ready` event received by the Xatkit engine will contain the following context values:
```
{
  'hostname': 'botium.xatkit', 
  'url':'http://botium.xatkit', 
  'origin': 'http://botium.xatkit'
}
```
