import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Request,
    UseGuards,
    Put,
    Query, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiConsumes, ApiQuery} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {AuthGuard} from "@nestjs/passport";
import {Public} from "../guard/jwt.guard";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @Public()
    @ApiQuery({required: true, name: 'password', type: String})
    @ApiQuery({required: true, name: 'email', type: String})
    async login(
        @Request() req: any,
    ) {
        return this.userService.login(req.user);
    }

    @Public()
    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Public()
    @Post('forgot-password')
    @ApiQuery({required: true, name: 'email', type: String})
    async forgotPassword(
        @Request() req: any
    ) {
        return this.userService.forgotPassword(req.query.email);
    }

    @Get()
    @ApiQuery({required: true, name: 'page', type: Number})
    @ApiQuery({required: true, name: 'limit', type: Number})
    @ApiQuery({required: false, name: 'search', type: String})
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        return this.userService.findAll(page, limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = `${Date.now()}-${file.originalname}`;
                cb(null, filename);
            },
        })
    }))
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
            }),
        ) image?: Express.Multer.File,
    ) {
        return this.userService.update(id, updateUserDto, image);
    }

    @Post('logout')
    logout(
        @Request() req: any,
    ) {
        return this.userService.logout(req);
    }
}
