# Algo Address Tracker

*App that tracks Algo balances in real time*

## Tools and technologies used:
* Node 20.9.0
* Typescript
* Next.js 14
* Tailwind
* Prisma ORM
* Planetscale
* Express.js
* Websockets
## Usage
Place a .env file in the root of the project that contains the following variables:
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
$ npm run dev
```
Deploy on vercel:
```
$ npm i -g vercel && vercel deploy
```
