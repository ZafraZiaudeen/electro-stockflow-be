"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseEntryDTO = void 0;
const zod_1 = require("zod");
exports.CreatePurchaseEntryDTO = zod_1.z.object({
    poNumber: zod_1.z.string(),
    purchaseDate: zod_1.z
        .string()
        .transform((val) => new Date(val))
        .refine((val) => !isNaN(val.getTime()), { message: "Invalid date format" })
        .optional(),
    grn: zod_1.z.string(),
    totalValue: zod_1.z.number().default(0.00),
    items: zod_1.z.array(zod_1.z.object({
        partNumber: zod_1.z.string(),
        makeCompany: zod_1.z.string(),
        description: zod_1.z.string(),
        unit: zod_1.z.enum(["Box", "Packets", "EA", "Roll", "Pieces", "Nos", "Meters", "Lot"]),
        packing: zod_1.z.number().default(1),
        unitPrice: zod_1.z.number().default(0.00),
        quantity: zod_1.z.number().default(0),
    })),
});
//# sourceMappingURL=purchase.js.map