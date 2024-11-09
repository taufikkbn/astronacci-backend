import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsOptional} from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    confirmPassword?: string;

    @ApiProperty({
        description: 'Image',
        format: 'binary',
        type: 'string',
        required: false,
    })
    @IsOptional()
    image?: any;
}
