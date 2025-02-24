import { WebSocket, WebSocketServer } from 'ws';
import { Collection } from 'mongodb';


export const createWebSocketService = (wss: WebSocketServer, collection: Collection) => {
    let changeStream: any = null;
    let reconnectTimer: NodeJS.Timeout;
    const clients: Set<WebSocket> = new Set();

    const emitMessage = (message: any) => {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'newMessage',
                    message: message
                }));
            }
        });
    }


    const startChangeStream = async () => {
        try {

            changeStream = collection.watch([], { fullDocument: 'updateLookup' });

            changeStream.on('change', (change: any) => {
                if (change._id && change.operationType === 'insert') {
                    emitMessage(change.fullDocument);
                }
            });

            changeStream.on('error', (error: Error) => {
                console.error('Change stream error:', error);
                throw error;
            });

        } catch (error) {
            console.error('Error setting up change stream:', error);
            reconnectTimer = setTimeout(startChangeStream, 1000);
        }
    };

    const initialize = () => {
        wss.on('connection', async (ws) => {
            clients.add(ws);

            ws.on('close', () => {
                clients.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket client error:', error);
                clients.delete(ws);
            });
        });

        startChangeStream();
    };

    const cleanup = async () => {
        if (changeStream) {
            await changeStream.close();
        }
        clients.forEach(client => client.close());
        clients.clear();
        clearTimeout(reconnectTimer);
    };

    return { initialize, cleanup };
};