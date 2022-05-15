using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using chat_backend.Hubs;
using chat_backend.Models;

namespace chat_backend.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [Route("send")]     // https://localhost:44379/api/chat/send
        [HttpPost]
        public IActionResult SendRequest([FromBody] Message msg)
        {
            _hubContext.Clients.All.SendAsync("ReceiveOne", msg.user, msg.msgtext);
            return Ok();
        }
    }
}
