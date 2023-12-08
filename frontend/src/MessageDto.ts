export class MessageDto {
    content: string;
    time : string;
    username : string;
    constructor(content: string, time: string, username : string ) {
      this.content = content;
      this.time = time;
      this.username = username;
    }
  }