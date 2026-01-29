
# Sikkim Demo Data Constants

DISTRICTS = [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan"
]

CLUSTERS = {
    "Gangtok": ["Gangtok Town Loop", "Rumtek - Rural Belt", "Ranka Valley"],
    "Namchi": ["Namchi Heritage Loop", "Temi Tea Corridor", "Ravangla Axis"],
    "Gyalshing": ["Pelling Viewpoint Belt", "Yuksom Trailhead Zone", "Khecheopalri Sector"],
    "Mangan": ["Mangan Riverside Belt", "Lachen/Lachung Corridor (Coarse)", "Dzongu Reserve"]
}

TRANSPORT_HUBS = {
    "Gangtok": [
        {"name": "Gangtok Taxi Stand", "type": "TAXI_POINT"},
        {"name": "SNT Bus Stand", "type": "BUS_STAND"},
        {"name": "Private Jeep Stand", "type": "TAXI_POINT"}
    ],
    "Namchi": [
        {"name": "Namchi Central Bazaar Taxi Stand", "type": "TAXI_POINT"},
        {"name": "District HQ Transit Point", "type": "OTHER"}
    ],
    "Gyalshing": [
        {"name": "Gyalshing Shared Jeep Stand", "type": "TAXI_POINT"},
        {"name": "Pelling Junction", "type": "OTHER"}
    ],
    "Mangan": [
        {"name": "Mangan Taxi Stand", "type": "TAXI_POINT"},
        {"name": "North Sikkim Transport Hub", "type": "BUS_STAND"}
    ]
}

# Hotspots (Discovery)
HOTSPOTS = [
    # Gangtok
    {
        "name": "MG Marg Promenade",
        "short_description": "The heart of Gangtok, a vehicle-free zone with shops and benches.",
        "description": "Mahatma Gandhi Marg is the main street of Gangtok, the capital of Sikkim. It is a litter-free, spit-free, and smoke-free zone. The road is lined with shops, restaurants, and hotels. It serves as a meeting place and a relaxed environment for tourists and locals alike.",
        "district": "Gangtok",
        "cluster": "Gangtok Town Loop",
        "tags": ["Shopping", "Food", "Leisure", "Urban"],
        "duration_min": 60,
        "distance_band": "NEAR",
        "approx_travel_time_min": 10,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?street,market" 
    },
    {
        "name": "Rumtek Monastery Approach",
        "short_description": "Scenic route leading to one of the largest monasteries in Sikkim.",
        "description": "The drive to Rumtek offers panoramic views of Gangtok town on the opposite hill. The area surrounding the monastery is peaceful and offers varied walks through paddy fields and rural settlements.",
        "district": "Gangtok",
        "cluster": "Rumtek - Rural Belt",
        "tags": ["Heritage", "Nature", "Quiet"],
        "duration_min": 120,
        "distance_band": "MEDIUM",
        "approx_travel_time_min": 45,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?monastery,himalaya"
    },
    {
        "name": "Ban Jhakri Falls Park",
        "short_description": "Energy park featuring waterfalls and shamanistic sculptures.",
        "description": "A landscaped park with a beautiful waterfall, dedicated to the Ban Jhakri (traditional forest shaman). It features ethnic sculptures and peaceful gazebos, making it a perfect spot for families.",
        "district": "Gangtok",
        "cluster": "Ranka Valley",
        "tags": ["Nature", "Family", "Park"],
        "duration_min": 60,
        "distance_band": "NEAR",
        "approx_travel_time_min": 25,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?waterfall,park"
    },
    {
        "name": "Tashi View Point",
        "short_description": "Panoramic views of Mt. Kanchenjunga and the surrounding valleys.",
        "description": "Best visited at sunrise, this viewpoint offers a stunning panorama of the snow-capped mountains. A small cafeteria provides hot tea and snacks while you gaze at the majesty of the Himalayas.",
        "district": "Gangtok",
        "cluster": "Gangtok Town Loop",
        "tags": ["Viewpoint", "Nature", "Photography"],
        "duration_min": 45,
        "distance_band": "NEAR",
        "approx_travel_time_min": 20,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?mountain,view"
    },
    # Namchi
    {
        "name": "Temi Tea Garden",
        "short_description": "Sikkim's only tea estate, offering lush green landscapes.",
        "description": "Sprawling across a gentle slope, Temi Tea Garden produces top-quality organic tea. The cherry blossom trees lining the road add to the charm in winter. Visitors can tour the factory and taste fresh tea.",
        "district": "Namchi",
        "cluster": "Temi Tea Corridor",
        "tags": ["Tea", "Nature", "Landscape"],
        "duration_min": 180,
        "distance_band": "MEDIUM",
        "approx_travel_time_min": 60,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?tea,garden"
    },
    {
        "name": "Samdruptse Hill",
        "short_description": "Home to the towering statue of Guru Padmasambhava.",
        "description": "Samdruptse, keeping the 'wish-fulfilling hill', features a gigantic gilded statue of Guru Rinpoche. The premises offer a peaceful retreat and a commanding view of the Namchi area.",
        "district": "Namchi",
        "cluster": "Namchi Heritage Loop",
        "tags": ["Heritage", "Viewpoint", "Spiritual"],
        "duration_min": 60,
        "distance_band": "NEAR",
        "approx_travel_time_min": 15,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?statue,buddhism"
    },
    {
        "name": "Ravangla Buddha Park",
        "short_description": "A serene park featuring a massive Buddha statue.",
        "description": "Located near Ravangla, this park (Tathagata Tsal) hosts a beautiful Buddha statue. The manicured gardens and the peaceful ambiance make it a must-visit for relaxation and reflection.",
        "district": "Namchi",
        "cluster": "Ravangla Axis",
        "tags": ["Heritage", "Park", "Quiet"],
        "duration_min": 90,
        "distance_band": "FAR",
        "approx_travel_time_min": 75,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?buddha,park"
    },
    # Gyalshing
    {
        "name": "Pelling Skywalk",
        "short_description": "Glass skywalk leading to the Chenrezig statue.",
        "description": "Experience the thrill of walking on glass with a deep valley beneath, leading up to the magnificent statue of Chenrezig. On a clear day, the Kanchenjunga range is right in front of you.",
        "district": "Gyalshing",
        "cluster": "Pelling Viewpoint Belt",
        "tags": ["Adventure", "Viewpoint", "Heritage"],
        "duration_min": 60,
        "distance_band": "NEAR",
        "approx_travel_time_min": 15,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?skywalk,mountain"
    },
    {
        "name": "Khecheopalri Lake",
        "short_description": "A sacred wish-fulfilling lake nestled in the forest.",
        "description": "Considered holy by both Buddhists and Hindus, this lake is believed to be wish-fulfilling. It is surprisingly clean, said to be kept that way by birds picking up leaves.",
        "district": "Gyalshing",
        "cluster": "Khecheopalri Sector",
        "tags": ["Nature", "Spiritual", "Lake"],
        "duration_min": 90,
        "distance_band": "MEDIUM",
        "approx_travel_time_min": 60,
        "sensitivity_level": "PROTECTED",
        "image_url": "https://source.unsplash.com/800x600/?lake,forest"
    },
    {
        "name": "Yuksom Coronation Throne",
        "short_description": "The historic site where the first Chogyal was crowned.",
        "description": "Norbugang Chorten and the Coronation Throne mark the birthplace of the Sikkim kingdom. A site of immense historical significance, surrounded by ancient pine trees.",
        "district": "Gyalshing",
        "cluster": "Yuksom Trailhead Zone",
        "tags": ["History", "Heritage", "Quiet"],
        "duration_min": 45,
        "distance_band": "FAR",
        "approx_travel_time_min": 90,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?throne,history"
    },
    # Mangan
    {
        "name": "Seven Sisters Waterfall",
        "short_description": "A majestic waterfall on the North Sikkim Highway.",
        "description": "A popular stopover on the way to North Sikkim. The water falls in seven distinct stages, best viewed during the monsoon season.",
        "district": "Mangan",
        "cluster": "Mangan Riverside Belt",
        "tags": ["Nature", "Waterfall", "Stopover"],
        "duration_min": 30,
        "distance_band": "NEAR",
        "approx_travel_time_min": 30,
        "sensitivity_level": "PUBLIC",
        "image_url": "https://source.unsplash.com/800x600/?waterfall,nature"
    },
    {
        "name": "Dzongu Reserve Area",
        "short_description": "Protected area for the Lepcha community.",
        "description": "A restricted area that preserves the culture and lifestyle of the Lepcha people. Entry requires a special permit. It offers untouched nature and authentic cultural immersion.",
        "district": "Mangan",
        "cluster": "Dzongu Reserve",
        "tags": ["Culture", "Nature", "Restricted"],
        "duration_min": 180,
        "distance_band": "MEDIUM",
        "approx_travel_time_min": 60,
        "sensitivity_level": "PROTECTED",
        "image_url": "https://source.unsplash.com/800x600/?village,mountain"
    }
]

# Sights (Static Catalog)
SIGHTS = [
    {
        "name": "Pemayangtse Monastery",
        "short_description": "One of the oldest and premier monasteries of Sikkim.",
        "district": "Gyalshing",
        "cluster": "Pelling Viewpoint Belt",
        "sights_category": "MONASTERY",
        "image_url": "https://source.unsplash.com/800x600/?monastery,buddhism"
    },
    {
        "name": "Dubdi Monastery",
        "short_description": "The first monastery established in Sikkim (1701).",
        "district": "Gyalshing",
        "cluster": "Yuksom Trailhead Zone",
        "sights_category": "HERITAGE",
        "image_url": "https://source.unsplash.com/800x600/?ancient,building"
    },
    {
        "name": "Lachung Monastery",
        "short_description": "Picturesque monastery in the apple valley.",
        "district": "Mangan",
        "cluster": "Lachen/Lachung Corridor (Coarse)",
        "sights_category": "MONASTERY",
        "image_url": "https://source.unsplash.com/800x600/?snow,monastery"
    },
    {
        "name": "Siddheshwar Dham (Char Dham)",
        "short_description": "Cultural complex with replicas of 12 Jyotirlingas.",
        "district": "Namchi",
        "cluster": "Namchi Heritage Loop",
        "sights_category": "HERITAGE",
        "image_url": "https://source.unsplash.com/800x600/?temple,india"
    },
    {
        "name": "Enchey Monastery",
        "short_description": "200-year-old monastery blessed by Lama Drupthob Karpo.",
        "district": "Gangtok",
        "cluster": "Gangtok Town Loop",
        "sights_category": "MONASTERY",
        "image_url": "https://source.unsplash.com/800x600/?monk,prayer"
    },
    {
        "name": "Ganesh Tok",
        "short_description": "Small temple with a viewing lounge and pine trees.",
        "district": "Gangtok",
        "cluster": "Gangtok Town Loop",
        "sights_category": "VIEWPOINT",
        "image_url": "https://source.unsplash.com/800x600/?temple,view"
    },
    {
        "name": "Singhik View Point",
        "short_description": "Unobstructed view of Mt. Kanchenjunga and Mt. Siniolchu.",
        "district": "Mangan",
        "cluster": "Mangan Riverside Belt",
        "sights_category": "VIEWPOINT",
        "image_url": "https://source.unsplash.com/800x600/?mountain,snow"
    },
    {
        "name": "Rabdentse Ruins",
        "short_description": "Ruins of the second capital of Sikkim.",
        "district": "Gyalshing",
        "cluster": "Pelling Viewpoint Belt",
        "sights_category": "HERITAGE",
        "image_url": "https://source.unsplash.com/800x600/?ruins,stone"
    }
]

# Commerce Products
PRODUCTS = [
    {"title": "Organic Temi Tea (100g)", "price": 450.00, "vendor_id": 5001, "desc": "First flush organic black tea from Temi estate."},
    {"title": "Sikkim Large Cardamom", "price": 800.00, "vendor_id": 5002, "desc": "High quality large cardamom pods, locally grown."},
    {"title": "Handwoven Lepcha Bag", "price": 1200.00, "vendor_id": 5003, "desc": "Traditional geometric patterns, durable cotton."},
    {"title": "Bamboo Beer Mug", "price": 350.00, "vendor_id": 5004, "desc": "Crafted from mature bamboo, polished finish."},
    {"title": "Cherry Brandy Pickle", "price": 250.00, "vendor_id": 5002, "desc": "Local specialty pickle made from dallay chillies."},
    {"title": "Yak Wool Scarf", "price": 2200.00, "vendor_id": 5003, "desc": "Warm and soft scarf made from pure yak wool."},
    {"title": "Prayer Flags (Set of 5)", "price": 150.00, "vendor_id": 5004, "desc": "Cotton prayer flags printed with mantras."},
    {"title": "Thangka Painting (Print)", "price": 600.00, "vendor_id": 5004, "desc": "High quality print of wheel of life thangka."},
    {"title": "Ginger Paste (200g)", "price": 180.00, "vendor_id": 5002, "desc": "Organic ginger paste from local farms."},
    {"title": "Wood Carved Mask", "price": 3500.00, "vendor_id": 5003, "desc": "Traditional mask used in cham dances."}
]

# Safety Data
BROADCASTS = [
    {
        "category": "FESTIVAL",
        "title": "Pang Lhabsol Festival",
        "message": "Celebrations for Pang Lhabsol next week. Witness the warrior dance at Ravangla.",
        "severity": "INFO",
        "days_start": -2,
        "days_end": 5
    },
    {
        "category": "ADVISORY",
        "title": "Monsoon Road Advisory",
        "message": "Light landslides reported near Mangan. Drive with caution.",
        "severity": "WARNING",
        "days_start": 0,
        "days_end": 2
    },
    {
        "category": "INFO", # Fallback category if not in choices, defaulting to ADVISORY in logic
        "title": "Welcome to Sikkim",
        "message": "Please carry your trash back with you. Help us keep Sikkim clean and green.",
        "severity": "INFO",
        "days_start": -10,
        "days_end": 30
    }
]

RESTRICTIONS = [
    {
        "district": "Mangan",
        "type": "BORDER",
        "message": "Permit required for Gurudongmar Lake visits beyond Thangu.",
        "severity": "WARNING",
        "days_start": -30,
        "days_end": 30
    },
    {
        "district": "Gyalshing",
        "type": "FOREST",
        "message": "Plastic ban strictly enforced in Khecheopalri Lake area.",
        "severity": "INFO",
        "days_start": -30,
        "days_end": 30
    }
]

CONTACTS = [
    {"label": "Police Control Room", "phone": "100", "district": None, "notes": "Statewide Emergency"},
    {"label": "Tourism Helpline", "phone": "03592-209090", "district": None, "notes": "Tourist Information Centre"},
    {"label": "Gangtok Police", "phone": "03592-202022", "district": "Gangtok", "notes": "Sadar Thana"},
    {"label": "Namchi Hospital", "phone": "03595-263700", "district": "Namchi", "notes": "District Hospital"}
]
