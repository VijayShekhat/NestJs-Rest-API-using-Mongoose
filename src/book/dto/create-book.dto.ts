import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from "../schemas/book.schema"
import { User } from "../../auth/schemas/user.schema"



export class CreateBookDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please provide valid category' })
    readonly category: Category;

    @IsEmpty({ message: 'You can not pass user id.' })
    readonly user: User;

    @IsEmpty({ message: 'You can not pass user id.' })
    readonly lastUpdatedBy: User;
}