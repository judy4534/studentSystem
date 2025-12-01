import type mongoose from 'mongoose';

export const createDefaultSchemaOptions = <DocType>(): mongoose.SchemaOptions<DocType> => ({
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret: Record<string, any>) => {
            ret.id = ret._id?.toString();
            delete (ret as { _id?: unknown })._id;
        },
    },
});
