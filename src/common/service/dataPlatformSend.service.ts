import { Injectable } from '@nestjs/common';

@Injectable()
export class DataPlatformSendService {
  async send(list) {
    console.log(list);
  }
}
