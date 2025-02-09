import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { buildPaginator } from '@/utils/cursor-pagination';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import assert from 'assert';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserEntity } from './entities/user.entity';
import { paginate } from '@/utils/offset-pagination';
import { AuthProviderEntity } from './entities/auth-provider.entity';
import { AuthProviderType, Who } from '@/constants/entity.enum';
import { RoleEntity } from './entities/role.entity';
import { JobName, QueueName } from '@/constants/job.constant';
import { IEmailJob, ISendPasswordEmailJob } from '@/common/interfaces/job.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UpdateCurrentUserReqDto } from './dto/update-current-user.req.dto';
import { UpdateUserByAdminReqDto } from './dto/update-user-by-admin.req.dto';
import { RelationEntity } from '../relationship/entities/relation.entity';
import { InviterType, RelationStatus } from '@/constants/entity-enum/relation.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RelationEntity)
    private readonly relationRepository: Repository<RelationEntity>,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob, any, string>,
    @InjectRepository(AuthProviderEntity)
    private readonly authProviderRepository: Repository<AuthProviderEntity>,
  ) {}

  async create(dto: CreateUserReqDto): Promise<UserResDto> {
    const { username, email, avatarUrl, roles } = dto;

    const isAccountExist = await this.authProviderRepository.existsBy({
        email: email,
        providerType: AuthProviderType.EMAIL_PASSWORD
    })

    if (isAccountExist) {
      throw new ValidationException(ErrorCode.V000)
    }

    const userRoles = await this.roleRepository.findBy({
      rolename: In(roles)
    })

    const newUser = new UserEntity({
      username,
      avatarUrl: avatarUrl,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
      roles: userRoles
    });

    const savedUser = await this.userRepository.save(newUser);
    
    const password = this.generatePassword(10) //passowrd 10 character
    const newAccount = new AuthProviderEntity({
      email: email,
      password: password,
      providerType:AuthProviderType.EMAIL_PASSWORD,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID
    })

    await this.emailQueue.add(
      JobName.EMAIL_SEND_PASSWORD,
      {
        email: dto.email,
        password,
      } as ISendPasswordEmailJob,
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    await this.authProviderRepository.save(newAccount)
    this.logger.debug(savedUser);
    return plainToInstance(UserResDto, savedUser);
  }

  async findAll(
    reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedDto<UserResDto>> {        
    const query = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<UserEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(UserResDto, users), metaDto);
  }

  async loadMoreUsers(
    reqDto: LoadMoreUsersReqDto,
  ): Promise<CursorPaginatedDto<UserResDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'user',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(UserResDto, data), metaDto);
  }

  async findOne(id: Uuid): Promise<UserResDto> {
    assert(id, 'id is required');
    const user = await this.userRepository.findOneByOrFail({ id });

    return plainToInstance(UserResDto,user);
  }

  async update(id: Uuid, dto: UpdateUserByAdminReqDto, updator: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    const roles = await this.findRoleByName(dto.roles)
    user.avatarUrl = dto.image;
    user.username = dto.username;
    user.isActive = dto.isActive
    user.roles = roles;
    user.updatedBy = updator;

    await this.userRepository.save(user);
  }

  async updateMe(id: Uuid, dto: UpdateCurrentUserReqDto): Promise<UserResDto> {
    const user = await this.userRepository.findOneByOrFail({ id });
    // const account = await this.authProviderRepository.findOneByOrFail({id: user.authProviderId})

    Object.keys(dto).map(key => {
      user[key] = dto[key]
    })
    // user.email = account.email
    user.updatedBy = SYSTEM_USER_ID;
    
    const savedUser = await this.userRepository.save(user)
    return plainToInstance(UserResDto,savedUser)
  }

  async remove(id: Uuid) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
  }

  async searchUserByEmail(myId: Uuid,partnerEmail: string): Promise<any>{
    assert(partnerEmail, 'email is required');
    const user = await this.userRepository.findOneOrFail({
      where: { email: partnerEmail },
      select:['id','avatarUrl','bio','email','dob','username','gender']
    });
    const userId = user.id;

    const relation = await this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.requester', 'requester')
      .leftJoinAndSelect('relation.handler', 'handler')
      .where(
        '(relation.requesterId = :myId AND relation.handlerId = :userId) OR (relation.requesterId = :userId AND relation.handlerId = :myId)',
        { myId, userId }
      )
      .select([
        'relation.id',
        'relation.status',
        'requester.id',
        'requester.username',
        'requester.email',
        'requester.avatarUrl',
        'requester.dob',
        'requester.gender',
        'handler.id',
        'handler.username',
        'handler.email',
        'handler.avatarUrl',
        'handler.dob',
        'handler.gender',
      ])
      .getOne(); 
      
    if (!relation) {
      return{
        status: RelationStatus.NOTTHING,
        user: user
      }
    } 
      
    const inviter = myId == relation.requester.id ? InviterType.SELF : InviterType.OTHER

    return {
      id: relation.id,
      status: relation.status,
      inviter: inviter,
      user: inviter == InviterType.SELF ? relation.handler : relation.requester,
    }
  }

  private generatePassword(length: number): string{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++){
      password += characters[Math.floor(Math.random() * characters.length)]
    }
    return password
  }

  private async findRoleByName(roles: string | string[]): Promise<RoleEntity[]>{
    return await this.roleRepository.findBy({rolename: In(Array.isArray(roles) ? roles : [roles])})
  }
}
