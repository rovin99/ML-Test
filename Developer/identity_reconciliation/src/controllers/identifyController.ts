import { Request, Response } from 'express';
import { IdentifyService } from '../services/identifyService';

export class IdentityController {
    private IdentifyService: IdentifyService;

    constructor() {
        this.IdentifyService = new IdentifyService();
    }

    async identify(req: Request, res: Response) {
        try {
            const { email, phoneNumber } = req.body;
            const result = await this.IdentifyService.identifyContact(email, phoneNumber);
            res.json({ contact: result });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing the request" });
        }
    }
}