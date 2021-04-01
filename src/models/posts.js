import Mongoose from "mongoose";

const postSchema = new Mongoose.Schema({
    title: {
        type: String, 
        required: "o campo 'Title' é obrigatório"
    },
    content: String,
    author: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
}, {
    optimisticConcurrency: true,
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = doc._id;
            delete ret._id;
        }
    }
});

const PostModel = Mongoose.model("Posts", postSchema);

export default PostModel;

