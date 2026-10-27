import SubscriptionPlan from "@/lib/models/SubscriptionPlan";
import { crud } from "@/lib/crud";
export const { GET, POST, PUT, DELETE } = crud(SubscriptionPlan);
