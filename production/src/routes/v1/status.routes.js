"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const status_controller_1 = require("../../controllers/status.controller");
const status_schema_1 = require("../../schemas/status.schema");
const router = (0, express_1.Router)();
router.get('/', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive], status_controller_1.findAllStatusController);
router.post('/', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, auth_middleware_1.isRoleAdmin, (0, validate_middleware_1.validate)(status_schema_1.statusSchema.create)], status_controller_1.createStatusController);
router.put('/:id', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, auth_middleware_1.isRoleAdmin, (0, validate_middleware_1.validate)(status_schema_1.statusSchema.update)], status_controller_1.updateStatusController);
router.delete('/:id', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, auth_middleware_1.isRoleAdmin, (0, validate_middleware_1.validate)(status_schema_1.statusSchema.delete)], status_controller_1.deleteStatusController);
exports.default = router;
