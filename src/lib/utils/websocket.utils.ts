import { env } from "$src/env.mjs";

export async function sendMessageThroughWebsocket(type: string, data: string): Promise<void> {
    const ws = new WebSocket(env.WEBSOCKET_SERVER_URL);
    await new Promise<void>((resolve) => (ws.onopen = () => resolve()));
    ws.send(JSON.stringify({ type, data }));
    await new Promise<void>((resolve) => (ws.onmessage = () => resolve()));
    ws.close();
    await new Promise<void>((resolve) => (ws.onclose = () => resolve()));
}