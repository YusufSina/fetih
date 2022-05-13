using System.Collections.Generic;

namespace fetih_service.Dtos
{
    public class CityDto
    {

        public class MetaData
        {
            public int Id { get; set; }
            public string Description { get; set; }
            public string External_url { get; set; }
            public string Image { get; set; }
            public string Name { get; set; }
            public List<Attribute> Attributes { get; set; }
        }
        public class Attribute
        {
            public string Trait_type { get; set; }
            public int Value { get; set; }
        }
    }
}
