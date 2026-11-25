import { Router } from 'express';
import * as controller from '../controllers/menu.controller.js';
import { cekApiKey } from '../middlewares/cekApiKey.js';
import { validate, menuSchema } from '../validators/menu.validator.js';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', cekApiKey, validate(menuSchema), controller.create);
router.put('/:id', cekApiKey, validate(menuSchema), controller.update);
router.delete('/:id', cekApiKey, controller.remove);

export default router;
