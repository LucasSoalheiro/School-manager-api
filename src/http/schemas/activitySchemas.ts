import { z } from "zod";

export const updateDeliveryDateSchema = z.object({
  delivery_date: z
    .string()
    .datetime({ message: "Delivery date must be a valid ISO date-time string" })
    .transform((val) => new Date(val)),
});
