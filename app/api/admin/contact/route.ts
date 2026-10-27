import ContactMessage from "@/lib/models/ContactMessage";
import { crud } from "@/lib/crud";
export const { GET, POST, PUT, DELETE } = crud(ContactMessage);
