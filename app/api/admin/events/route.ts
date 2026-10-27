import Event from "@/lib/models/Event";
import { crud } from "@/lib/crud";
export const { GET, POST, PUT, DELETE } = crud(Event);
