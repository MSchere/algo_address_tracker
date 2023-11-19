# Algo Address Tracker

*Real-time monitoring dashboard for Algorand testnet account balances*

### Visit live site https://algo-address-tracker.vercel.app

## Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, Prisma, WebSockets 
- **Database:** PlanetScale MySQL
- **Deployment:** Vercel

## Usage
Place a .env file in the root of the project and supply your database and websocket URLs
```
DATABASE_URL="mysql://..."
NEXT_PUBLIC_WEBSOCKET_SERVER_URL="wss://.."
```
Install dependencies:
```
$ npm i
```
Run the development server:
```
$ npm run dev
```
Deploy on vercel:
```
$ npm i -g vercel && vercel deploy
```

## API Reference
### Create wallet
```
  POST /api/create-wallet/[address]
```
### Get wallet
```
  GET /api/get-wallet/[address]
```
### Get all wallets
```
  GET /api/get-all-wallets
```
### Update balance
```
  PUT /api/update-balance/[address]
```
### Update all balances
```
  PUT /api/update-all-balances
```
### Delete wallet
```
  DELETE /api/delete-wallet/[address]
```
### Get snapshot
```
  GET /api/get-snapshot/[address]
```
### Get all latest snapshots
```
  GET /api/get-latest-snapshots
```
### Get all snapshots
```
  GET /api/get-all-snapshots
```

