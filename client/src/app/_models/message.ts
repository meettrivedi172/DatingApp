export  interface  Messages{

  id:number;
  senderId:number;
  senderUserName:number;
  senderPhotoUrl:string;
  recipientId:number;
  recipientUsername:string;
  recipientPhotoUrl:string;
  content:string;
  dateRead?:Date;
  massageSent:Date;

}
