export class MessageDto {
    content: string;
    time : string;
    constructor(content: string, time: string) {
      this.content = content;
      this.time = time;
    }
  }