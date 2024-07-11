import { Router } from 'express';
import { validateInput } from '../../middlewares/validateInput';
import { IdentityController } from '../../controllers/identifyController';

const router = Router();
const identityController = new IdentityController();

router.post('/identify', validateInput, (req, res) => identityController.identify(req, res));

export default router;