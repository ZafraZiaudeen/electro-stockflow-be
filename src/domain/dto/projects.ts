import { z } from "zod"


export const CreateProjectDTO = z.object({
    name: z.string(),
    projectNumber: z.string(),
    description: z.string()
});