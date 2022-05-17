import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { MessageDto } from '../Dto/MessageDto';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:44379/chatsocket")
  .configureLogging(signalR.LogLevel.Information)
  .build();
  readonly POST_URL = "https://localhost:44379/api/chat/send";

  private receivedMessageObject: MessageDto = new MessageDto();
  private sharedObj = new Subject<MessageDto>();

  constructor(private http: HttpClient) { 
    this.connection.onclose(async () => {
      await this.start();
  });

  this.connection.on("ReceiveOne", (user: string, message: string) => { console.log('received');this.mapReceivedMessage(user, message);});
  }

  public async start() {

    try {
      await this.connection.start();
            console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    } 
  }


  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessageObject.msgText = user;
    this.receivedMessageObject.msgText = message;

    this.sharedObj.next(this.receivedMessageObject);

 }

 public broadcastMessage(msgDto: any) {
  this.http.post(this.POST_URL, msgDto).subscribe(data => console.log(data));
  // this.connection.invoke("SendMessage", msgDto.user, msgDto.msgText).catch(err => console.error(err));
}

public retrieveMappedObject(): Observable<MessageDto> {
  return this.sharedObj.asObservable();
}

}


