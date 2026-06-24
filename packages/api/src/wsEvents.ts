export const WS_EVENTS = {
  CONNECT: "client:connect",
  DISCONNECT: "client:disconnect",
  TICKET_CREATE: "client:ticket:create",
  TICKET_UPDATE: "client:ticket:update",
  TICKET_ARCHIVE: "client:ticket:archive",
  MESSAGE_SEND: "client:message:send",
  MESSAGE_READ: "client:message:read",
  GATE_REQUEST: "client:gate:request",
  GATE_RESPONSE: "client:gate:response",

  TICKET_CREATED: "server:ticket:created",
  TICKET_UPDATED: "server:ticket:updated",
  TICKET_ARCHIVED: "server:ticket:archived",
  MESSAGE_RECEIVED: "server:message:received",
  MESSAGE_READ_UPDATE: "server:message:read:update",
  GATE_ALERT: "server:gate:alert",
  GATE_RESPONSE_SENT: "server:gate:response:sent",
  HOUSE_UPDATED: "server:house:updated",
  MENU_UPDATED: "server:menu:updated",
  SERVICES_UPDATED: "server:services:updated",
  INFO_UPDATED: "server:info:updated",
  CONNECTION_STATUS: "server:connection:status",
} as const;

export type WSEventType = typeof WS_EVENTS[keyof typeof WS_EVENTS];

export interface WSEvent<T = unknown> {
  type: WSEventType;
  payload: T;
  timestamp: string;
}

export interface TicketCreatePayload {
  houseId: string;
  type: string;
  items?: { menuItemId: string; name: string; price: number; quantity: number }[];
  location?: string;
  geo?: string;
  desiredAt?: string;
  description?: string;
}

export interface TicketUpdatePayload {
  ticketId: string;
  status: string;
  assignedTo?: string;
}

export interface MessageSendPayload {
  houseId: string;
  text: string;
}

export interface GateRequestPayload {
  houseId: string;
}

export interface GateResponsePayload {
  ticketId: string;
  approved: boolean;
}
