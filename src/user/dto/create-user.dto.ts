import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({},{message: 'Invalid email'})
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20)
  confirmPassword: string;
}
