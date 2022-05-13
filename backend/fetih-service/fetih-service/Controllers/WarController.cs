using fetih_service.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace fetih_service.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WarController : ControllerBase
    {
        IWarService _serviceWar;

        public WarController(IWarService serviceWar)
        {
            _serviceWar = serviceWar;
        }


        [HttpGet("WarResult/{allyId}/{enemyId}/{allyTroops}/{enemyTroops}")]
        public IActionResult WarResult(int allyId, int enemyId, int allyTroops, int enemyTroops)
        {
            try
            {
                return Ok(_serviceWar.WarResult(allyId, enemyId, allyTroops, enemyTroops));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
