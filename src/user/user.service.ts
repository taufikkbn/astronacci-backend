import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {validate as isUuid} from 'uuid';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOneBy({email});
        if (!user) throw new BadRequestException({
            message: ['User Not Found'],
            error: 'Bad Request',
            statusCode: 400
        });

        const isMatch: boolean = bcrypt.compareSync(password, user.password);

        if (!isMatch) throw new BadRequestException({
            message: ['Invalid Credentials'],
            error: 'Bad Request',
            statusCode: 400
        });

        return user
    }

    async login(user: User) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            ...user,
            accessToken,
        };
    }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email })

        if (existingUser) throw new BadRequestException({
            message: ['User already exists'],
            error: 'Bad Request',
            statusCode: 400
        })

        if (createUserDto.password !== createUserDto.confirmPassword) throw new BadRequestException({
            message: ['Passwords do not match with confirm password'],
            error: 'Bad Request',
            statusCode: 400
        })

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = { ...createUserDto, password: hashedPassword };

        const user: User = await this.userRepository.save(newUser);
        return this.login(user)
    }

    async forgotPassword(email: string) {
        const user = await this.userRepository.findOneBy({email})
        if (!user) throw new BadRequestException({
            message: ['User Not Found'],
            error: 'Bad Request',
            statusCode: 400
        });

        user.password = await bcrypt.hash('123456', 10);
        await this.userRepository.update(user.id, user);

        return {
            message: 'Your password has been reset to 123456',
        }
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (search) {
            queryBuilder.where('user.name ILIKE :search OR user.email ILIKE :search', {
                search: `%${search}%`,
            });
        }

        queryBuilder
            .orderBy('LOWER(user.name)', 'ASC')
            .skip(skip)
            .take(limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        if (!isUuid(id)) throw new BadRequestException({
            message: ['Invalid UUID format'],
            error: 'Bad Request',
            statusCode: 400
        });

        const user = await this.userRepository.findOne({
            where: {id},
            select: ['id', 'name', 'email', 'image'],
        });

        if (!user) throw new BadRequestException({
            message: ['User not found'],
            error: 'Bad Request',
            statusCode: 400
        })

        return user
    }

    async update(id: string, updateUserDto: UpdateUserDto, image?: Express.Multer.File) {
        if (!isUuid(id)) throw new BadRequestException({
            message: ['Invalid UUID format'],
            error: 'Bad Request',
            statusCode: 400
        });

        if (updateUserDto.password !== updateUserDto.confirmPassword) throw new BadRequestException({
            message: ['Passwords do not match with confirm password'],
            error: 'Bad Request',
            statusCode: 400
        })

        const user = await this.userRepository.findOne({
            where: {id},
            select: ['id', 'name', 'email', 'image'],
        });

        if (!user) throw new BadRequestException({
            message: ['User not found'],
            error: 'Bad Request',
            statusCode: 400
        })

        console.log(image)

        if (image) {
            user.image = image.path;
        }
        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return await this.userRepository.update(id, user);
    }

    async logout(req: any) {
        const accessToken = req.headers['authorization'].split(' ')[1];

    }
}
