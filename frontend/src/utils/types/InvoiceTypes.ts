export interface InvoiceType {
  id: number;
  number: string;
  amount: number;
  currency: string;
  status: string;
  state: string;
  client_key: string;
  line_items: any;
  sent_at: string;
  due_date: string;
  subject: string;
}