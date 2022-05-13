using fetih_service.Dtos;
using fetih_service.Entities.FETIH;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace fetih_service.Services
{
    public interface ICityService
    {
        CityDto.MetaData CityDetail(int cityId);
    }
    public class CityService : ICityService
    {
        FetihDbContext _context;
        public CityService(FetihDbContext context)
        {
            _context = context;

        }

        public CityDto.MetaData CityDetail(int cityId)
        {
            try
            {
                //seçilen şehrin metadata verileri
                CityDto.MetaData cityDetail = _context.MetaData.Include(i => i.Attributes).Where(w => w.Id == cityId).Select(s => new CityDto.MetaData
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    External_url = s.ExternalUrl,
                    Image = s.Image,
                    Attributes = s.Attributes.Select(s2 => new CityDto.Attribute
                    {
                        Trait_type = s2.TraitType,
                        Value = s2.Value
                    }).ToList(),
                }).FirstOrDefault();

                return cityDetail;
            }
            catch
            {
                return new CityDto.MetaData();

            }
        }
    }
}
