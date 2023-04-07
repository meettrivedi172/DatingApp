using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;


namespace API.SignalR
{ 

    [Authorize]
    public class MessageHub:Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;

        public MessageHub(IMessageRepository  messageRepository,IUserRepository userRepository,IMapper  mapper,IHubContext<PresenceHub>  presenceHub )
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _presenceHub = presenceHub;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext =  Context.GetHttpContext();
            var otherUser =   httpContext.Request.Query["user"];
            var groupName =  GetGroupName(Context.User.GetUsername(),otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            await  AddToGroup(groupName);
            var message =await _messageRepository.GetMessageThread(Context.User.GetUsername(),otherUser);
           await Clients.Group(groupName).SendAsync("ReceiveMessageThread",message);
        }


        public async override Task OnDisconnectedAsync(Exception exception)
        {

            await RemoveFormMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }



        public async Task SendMessage(CreateMessageDto  createMessageDto){
             var username= Context.User.GetUsername();
            if(username == createMessageDto.RecipientUsername.ToLower())
             throw new HubException("You can not send message your self");

            var sender = await _userRepository.GetUserByUsernameAsync(username);

            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null)throw new HubException("Not found User");

            var message =new Message{


              Sender = sender,
              Recipient = recipient,
              SenderUserName=sender.UserName,
              RecipientUserName = recipient.UserName,
              Content=createMessageDto.Content

            };

            var groupName= GetGroupName(sender.UserName,recipient.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if(group.Connections.Any(x=>x.Username == recipient.UserName)){
                message.DateRead = DateTime.UtcNow;
            }else{
                var connection = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
                if(connection != null){
                    await _presenceHub.Clients(connection).SendAsync("NewMessageReceived",
                    new{username = sender.UserName,knownAs = sender.KnownAs}
                    );
                }
            }

              _messageRepository.AddMessage(message);

              if(await _messageRepository.SaveAllAsync()) 
              {
               
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDto>(message));
              }
      
        }

        private string GetGroupName(string caller,string other){
            var stringcompare = string.CompareOrdinal(caller,other)<0;
            return stringcompare? $"{caller}-{other}":$"{other}-{caller}";
        }



        private async Task<Group> AddToGroup(string groupName){

            var group =await _messageRepository.GetMessageGroup(groupName);
            var connection  = new Connection(Context.ConnectionId,Context.User.GetUsername());

            if(group == null){
                // group = new Group(groupName);
                group = new Group();
                _messageRepository.AddGroup(group);
            }
            group.Connections.Add(connection);

           if(  await _messageRepository.SaveAllAsync()) return group ;
        }


       private  async Task<Group> RemoveFormMessageGroup(){

            var connection = await _messageRepository.GetConnection(Context.ConnectionId);
            _messageRepository.RemoveConnection(connection);
            await _messageRepository.SaveAllAsync();

       }


    }
}