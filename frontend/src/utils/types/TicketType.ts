import { TicketMessageType } from "./TicketMessageType";

export interface TicketType {
  id: number;
  userId: number;
  createdBy: string;
  subject: string;
  description: string;
  status: string;
  messages: TicketMessageType[];
  createdAt: string;
  updatedAt: string;
}