import { z } from "zod";

export const CreatePurchaseEntryDTO = z.object({
  poNumber: z.string(),
  purchaseDate: z.date().optional(),
  grn: z.string(),
  totalValue: z.number().default(0.00),
  items: z.array(z.object({
    partNumber: z.string(),
    makeCompany: z.string(),
    description: z.string(),
    unit: z.enum(['Pieces', 'Units', 'Kgs', 'Liters']),
    packing: z.number().default(1),
    unitPrice: z.number().default(0.00),
    quantity: z.number().default(0),
  })),
});