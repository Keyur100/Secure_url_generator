import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getSecretModel } from '../models/getSecretModel.js';
import mongoose from 'mongoose';
const router = express.Router();
const TTL_MINUTES = parseInt(process.env.SECRET_TTL_MINUTES || '10');
/**
 * @swagger
 * /api/secrets:
 *   post:
 *     summary: Create a new one-time secret
 *     tags: [Secrets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - secret
 *             properties:
 *               secret:
 *                 type: string
 *                 example: monkey-@42!
 *     responses:
 *       201:
 *         description: Secret created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link:
 *                   type: string
 *       400:
 *         description: Missing secret in request
 */
router.post('/', async (req, res) => {
    const { secret } = req.body;
    if (!secret || typeof secret !== 'string') {
        return res.status(400).json({ error: 'Secret is required' });
    }
    const Secret = getSecretModel(secret[0]);
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000);
    await Secret.create({ _id: id, secretText: secret, expiresAt });
    return res.status(201).json({ link: `/secret/${id}` });
});
/**
 * @swagger
 * /api/secrets/{id}:
 *   get:
 *     summary: Retrieve and consume a one-time secret
 *     tags: [Secrets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Secret successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 secret:
 *                   type: string
 *       403:
 *         description: Secret has already been viewed
 *       404:
 *         description: Secret not found or expired
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || !id[0]) {
        return res.status(400).json({ error: 'Invalid secret ID' });
    }
    if (!mongoose.connection.db) {
        return res.status(500).json({ error: 'Database not connected yet' });
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    const matchedSecrets = [];
    for (const col of collections) {
        const Secret = getSecretModel(col.name[0]); // Fallback to 'a'
        const result = await Secret.findById(id);
        if (result) {
            matchedSecrets.push({ Secret, result });
            break;
        }
    }
    if (matchedSecrets.length === 0) {
        return res.status(404).json({ error: 'Secret not found or expired' });
    }
    const { result } = matchedSecrets[0];
    if (result.used) {
        return res.status(403).json({ error: 'Secret has already been viewed' });
    }
    result.used = true;
    result.viewedAt = new Date();
    await result.save();
    return res.status(200).json({ secret: result.secretText });
});
export default router;
//# sourceMappingURL=secretRoutes.js.map