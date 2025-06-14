import { z } from "zod";

export const CreatePurchaseEntryDTO = z.object({
  poNumber: z.string(),
  purchaseDate: z
    .string()
    .transform((val) => new Date(val)) // Transform string to Date
    .refine((val) => !isNaN(val.getTime()), { message: "Invalid date format" }) // Validate Date
    .optional(),
  grn: z.string(),
  totalValue: z.number().default(0.00),
  items: z.array(
    z.object({
      partNumber: z.string(),
      makeCompany: z.string(),
      description: z.string(),
      unit: z.enum(["Box", "Packets", "EA", "Roll", "Pieces", "Nos", "Meters", "Lot"]),
      packing: z.number().default(1),
      unitPrice: z.number().default(0.00),
      quantity: z.number().default(0),
    })
  ),
});