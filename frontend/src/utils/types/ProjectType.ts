export interface ProjectType {
  id: number;
  name: string;
  code: string | null;
  is_active: boolean;
  client: {
    id: number;
    name: string;
  };
  notes: string;
  hourly_rate: number | null;
  starts_on: string;
  ends_on: string;
  fee: number | null;
}