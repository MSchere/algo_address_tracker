# Algo Address Tracker

*Real-time monitoring dashboard for Algorand tesnet account balances*

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
