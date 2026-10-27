import Offer from "@/lib/models/Offer";
import { crud } from "@/lib/crud";
export const { GET, POST, PUT, DELETE } = crud(Offer);
