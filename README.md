# Algo Address Tracker

*App that tracks Algorand balances in real time.*

## Tools and technologies used:
* Next.js 14
* Typescript
* Prisma ORM
* Planetscale
* Express.js
* Websockets

## Usage
Place a .env file in the root of the project that contains the following variables
```
DATABASE_URL="mysql://..."
NEXT_PUBLIC_WEBSOCKET_SERVER_URL="wss://.."

```
Install dependencies:
```
$ npm i

```
Run on localhost:
```
npm run dev
```