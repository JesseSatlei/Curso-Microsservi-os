import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge.status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusPermitidos = [
    ChallengeStatus.ACEITO,
    ChallengeStatus.NEGADO,
    ChallengeStatus.CANCELADO
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.statusValid(status)) {
      throw new BadRequestException(`${status} invalid`);
    }

    return value;
  }

  private statusValid(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
