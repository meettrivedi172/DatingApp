using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController:BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public MessagesController(IUnitOfWork uow,IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto){

            var username= User.GetUsername();
            if(username == createMessageDto.RecipientUsername.ToLower())
            return BadRequest("You cannot send message to yourself");

            var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);

            var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null)return NotFound();

            var message =new Message{


              Sender = sender,
              Recipient = recipient,
              SenderUserName=sender.UserName,
              RecipientUserName = recipient.UserName,
              Content=createMessageDto.Content

            };

              _uow.MessageRepository.AddMessage(message);

              if(await _uow.Complete()) return Ok(_mapper.Map<MessageDto>(message));

              return BadRequest("failed to send message");

        }


        [HttpGet]

        public async Task<ActionResult<PageList<MessageDto>>> GetMessageForUser([FromQuery]MessageParams messageParams){

            messageParams.Username = User.GetUsername();

            var message = await _uow.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(new PaginationHeader(message.CurrentPage,message.PageSize,message.TotalCount,message.TotalPage));

            return message;
        }


        // [HttpGet("thread/{username}")]

        // public async Task<ActionResult<IEnumerable<MessageDto>>>GetMessageThread(string username){
         
        //  var currentUserName = User.GetUsername();

        //  return Ok(await  _uow.MessageRepository.GetMessageThread(currentUserName,username));

        // }


        [HttpDelete("{id}")]

        public  async  Task<ActionResult> DeleteMessage(int id){

            var username = User.GetUsername();

            var message = await  _uow.MessageRepository.GetMessage(id);

            if(message.SenderUserName !=  username && message.RecipientUserName != username) return Unauthorized();

            if(message.SenderUserName == username)message.SenderDeleted =true;

            if(message.RecipientUserName == username)message.RecipientDeleted=true;

            if(message.SenderDeleted && message.RecipientDeleted){
                _uow.MessageRepository.DeleteMessage(message);
            }

            if(await _uow.Complete()) return Ok();

            return BadRequest("Problem  deleting the message");


        }



    }
}