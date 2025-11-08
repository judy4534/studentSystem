// Fix: Add export {} to make this file a module and allow global augmentation.
export {};

declare global {
    namespace Express {
        interface Request {
            user?: import('../models').IUser | null;
        }
    }
}