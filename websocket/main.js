const express = require("express");
const fs = require("fs");
const https = require("https");

// Require WebSocket module
const WebSocketServer = require("ws").Server;

// Constants
const EXPRESS_PORT = 3000;
const CERT_PATH = "/etc/letsencrypt/live/XXX/fullchain.pem";
const CERT_PVK_PATH = "/etc/letsencrypt/live/XXX/privkey.pem";

// App class
class App {
    constructor() {
        this.startServer();
    }

    startServer() {
        // Create express app
        this.express = express();

        // Read certs
        const key = fs.readFileSync(CERT_PVK_PATH);
        const cert = fs.readFileSync(CERT_PATH);

        // Routes
        const router = express.Router();
        router.all("/", (req, res) => res.send("Hello world!"));
        this.express.use("/", router);

        // Create HTTPS server
        const server = https.createServer({ key, cert }, this.express);

        // Start listening
        server.listen(EXPRESS_PORT, (err) => {
            if (err) {
                console.log("Error starting server: ", err);
                process.exit();
            }

            console.log(`Server listening on port ${EXPRESS_PORT}`);
        });

        // Create WebSocket server
        const wss = new WebSocketServer({ server });

        // WebSocket handlers
        wss.on("connection", (ws) => {
            console.log(`Client connected! Total clients: ${wss.clients.size}`);

            ws.send(JSON.stringify({ type: "status", data: "connected" }));

            ws.on("close", () => console.log("Client disconnected"));

            ws.on("message", (data) => {
                wss.clients.forEach((client) => {
                    client.send(`${data}`);
                });
            });

            ws.onerror = (err) => {
                console.error("WebSocket error", err.message);
                ws.close();
            };
        });
    }
}

// Export express app
module.exports = new App().express;
