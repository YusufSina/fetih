using fetih_service.Services;
using Microsoft.AspNetCore.Mvc;
using System;

namespace fetih_service.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        ICityService _serviceCity;

        public CityController(ICityService serviceCity)
        {
            _serviceCity = serviceCity;
        }


        [HttpGet("CityDetail/{cityId}")]
        public IActionResult GetGeneralInformation(int cityId)
        {
            try
            {
                return Ok(_serviceCity.CityDetail(cityId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
