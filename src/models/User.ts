import mongoose, { Document, Model} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    role: "admin";
}

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    }
})

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

