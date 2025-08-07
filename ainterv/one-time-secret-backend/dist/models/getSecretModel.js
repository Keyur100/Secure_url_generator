import mongoose from 'mongoose';
const secretSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    secretText: { type: String, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    viewedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
});
// TTL Index
secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const models = {};
export function getSecretModel(firstChar) {
    const collectionName = `${firstChar.toLowerCase()}_secrets`;
    if (!models[collectionName]) {
        models[collectionName] = mongoose.model(collectionName, secretSchema, collectionName);
    }
    return models[collectionName];
}
//# sourceMappingURL=getSecretModel.js.map