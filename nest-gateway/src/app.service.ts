import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getFront(): string {
    return 'Return front';
  }

  checkUser(username: string) {
    return `Check ${username}`;
  }

  checkTokens(): string {
    return "Check tokens";
  }

  logout(): string {
    return "Logout";
  }
}
