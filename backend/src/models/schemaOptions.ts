import type mongoose from 'mongoose';

const stripMongoId = (_doc: unknown, ret: Record<string, any>): void => {
    ret.id = ret._id?.toString();
    delete (ret as { _id?: unknown })._id;
};

const defaultSerialization = {
    virtuals: true,
    versionKey: false,
    transform: stripMongoId,
} satisfies mongoose.SchemaOptions['toJSON'];

export const createDefaultSchemaOptions = <DocType>(): mongoose.SchemaOptions<DocType> => ({
    timestamps: true,
    toJSON: defaultSerialization,
    toObject: defaultSerialization,
});
