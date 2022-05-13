using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace fetih_service.Controllers
{

    //fetih db 
    // Scaffold-DbContext -Connection "data source=fetih-live-db.mssql.somee.com;initial catalog=fetih-live-db;User Id=akupcuoglu_SQLLogin_3;Password=sd6onnksiw;MultipleActiveResultSets=True;App=EntityFramework" -Provider Microsoft.EntityFrameworkCore.SqlServer -OutputDir "Entities/FETIH" -Context "FetihDbContext" –Force

    //      MS SQL Server address:	fetih-live-db.mssql.somee.com
    //      Login name:	            akupcuoglu_SQLLogin_3
    //      Login password:	        sd6onnksiw



    [ApiController]
    [Route("[controller]")]
    public class VersionController : ControllerBase
    {

        private readonly ILogger<VersionController> _logger;

        public VersionController(ILogger<VersionController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "FETIH SERVICE", GetType().Assembly.GetName().Version.ToString(), "© 2022", DateTime.Now.AddHours(+3).ToString("dd/MM/yyyy HH:mm") };
        }
    }
}
