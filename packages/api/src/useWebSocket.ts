import { useEffect, useRef, useCallback, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const RECONNECT_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 10;

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMessage, onConnect, onDisconnect, autoConnect = true } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => { setIsConnected(true); reconnectAttempts.current = 0; onConnect?.(); };
      ws.onclose = () => {
        setIsConnected(false); onDisconnect?.();
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimer.current = setTimeout(() => { reconnectAttempts.current++; connect(); }, RECONNECT_DELAY * Math.min(reconnectAttempts.current + 1, 5));
        }
      };
      ws.onerror = () => { ws.close(); };
      ws.onmessage = (event) => {
        try { onMessage?.(JSON.parse(event.data)); } catch { console.error("Failed to parse WS message"); }
      };
    } catch { console.error("Failed to create WebSocket connection"); }
  }, [onMessage, onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    reconnectAttempts.current = MAX_RECONNECT_ATTEMPTS;
    wsRef.current?.close(); wsRef.current = null; setIsConnected(false);
  }, []);

  const send = useCallback((type: string, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload, timestamp: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) connect();
    return () => { disconnect(); };
  }, [autoConnect, connect, disconnect]);

  return { isConnected, connect, disconnect, send };
}
