import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../enums/role.enum";
import { Exclude } from "class-transformer";



@Schema({
    timestamps: true,
})
export class User extends Document {

    @Prop()
    name: string

    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: String

    @Prop()
    @Exclude()
    password: String

    @Prop({
        type: [{ type: String, enum: Role }],
        default: [Role.User]
    })
    role: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)