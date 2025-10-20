"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectDTO = void 0;
const zod_1 = require("zod");
exports.CreateProjectDTO = zod_1.z.object({
    name: zod_1.z.string(),
    projectNumber: zod_1.z.string(),
    description: zod_1.z.string()
});
//# sourceMappingURL=projects.js.map