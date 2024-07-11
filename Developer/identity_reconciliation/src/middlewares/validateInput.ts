import { Request, Response, NextFunction } from 'express';

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "Either email or phoneNumber must be provided" });
    }

    if (email && typeof email !== 'string') {
        return res.status(400).json({ error: "Email must be a string" });
    }

    if (phoneNumber && typeof phoneNumber !== 'string') {
        return res.status(400).json({ error: "PhoneNumber must be a string" });
    }

    next();
};