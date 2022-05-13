using fetih_service.Dtos;
using fetih_service.Entities.FETIH;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace fetih_service.Services
{
    public interface IWarService
    {
        WarDto.Result WarResult(int allyId, int enemyId, int allyTroops, int enemyTroops);
    }
    public class WarService : IWarService
    {
        FetihDbContext _context;
        public WarService(FetihDbContext context)
        {
            _context = context;
        }

        public WarDto.Result WarResult(int allyId, int enemyId, int allyTroops, int enemyTroops)
        {
            try
            {
                Random random = new Random();
                //saldıran şehrin saldırı gücü 
                int attack_power = _context.Attributes.Where(w => w.MetaDataId == allyId).Select(s => s.Value).FirstOrDefault();

                //savunan şehrin savunma gücü
                int defence_power = _context.Attributes.Where(w => w.MetaDataId == enemyId).Select(s => s.Value).FirstOrDefault();

                //savaş katsayıları ile % kaç oranında kazanacağı belirlenir.
                double trueProbability = ((Convert.ToDouble(allyTroops) * attack_power) / ((Convert.ToDouble(allyTroops) * attack_power) + (Convert.ToDouble(enemyTroops) * defence_power)));

                // kazanma oranına göre sonuç üretilir.
                bool result = random.NextDouble() < trueProbability;

                return new WarDto.Result { IsSucceed = result };
            }
            catch
            {
                return new WarDto.Result { IsSucceed = false };
            }
        }
    }
}
