import { ChallengeStatus } from '../interfaces/challenge.status.enum';
import { IsOptional } from 'class-validator';

export class UpdateChallengerDto {

  @IsOptional()
  dateTimeChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;

}
