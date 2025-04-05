// user/dto/update-customer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { BaseUserUpdateDto } from './base-user-dto';

export class UpdateCustomerDto extends PartialType(BaseUserUpdateDto) {}
