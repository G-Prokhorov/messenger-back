import {BadRequestException, Injectable} from '@nestjs/common';
import {checkTokensInterface} from "./interface/app.interface";
import findUser from "./db/findUser";
import * as path from "path";

@Injectable()
export class AppService {
  getFront(res) {
    res.sendFile(path.resolve("public/index.html"));
  }

  async checkUser(username: string) {
    if (!username) {
      throw new BadRequestException();
    }

    try {
      username = "@" + username;
    } catch {
      throw new BadRequestException();
    }

    let result = await findUser(username);
    if (result) {
      return ("exist");
    } else {
      return ("clear");
    }
  }

  checkTokens(body:checkTokensInterface) {
    return {
      username: body._userName_,
      name: body._u_name_,
      email: body._emailUser_,
    };
  }

  logout(res) {
    res.clearCookie("token")
        .clearCookie("refreshToken").status(200).send("clear");
  }
}
