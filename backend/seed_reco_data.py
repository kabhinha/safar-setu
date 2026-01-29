import os
import django
import sys
import random

sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'apps'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from listings.models import Hotspot
from users.models import User

# Ensure a host user exists
host, _ = User.objects.get_or_create(email="test_host@safarsetu.com", defaults={'role': 'HOST'})

districts = ['Guwahati']
tags_pool = ['Nature', 'Food', 'Culture', 'Adventure', 'Shopping', 'History', 'Crafts']

for dist in districts:
    # Always ensure we have a "Crafts" specific item for testing
    if not Hotspot.objects.filter(district__iexact=dist, tags__contains=['Crafts'], status=Hotspot.Status.Live).exists():
        print(f"Creating forced Crafts item in {dist}...")
        Hotspot.objects.create(
            host=host,
            name=f"{dist} Artisan Workshop",
            description=f"Learn local crafts in {dist}.",
            short_description="Handicrafts and more.",
            district=dist,
            status=Hotspot.Status.Live,
            duration_minutes=60,
            operating_hours="10:00 - 16:00",
            tags=['Crafts', 'Culture'],
            approx_travel_time_min=30,
            distance_band='NEAR',
            nearest_transport_hub_name=f"{dist} Central Station",
            nearest_transport_hub_type='RAILWAY_STATION'
        )
    count = Hotspot.objects.filter(district__iexact=dist, status=Hotspot.Status.Live).count()
    print(f"[{dist}] Current Live Hotspots: {count}")
    
    if count < 3:
        print(f"Seeding data for {dist}...")
        for i in range(3 - count):
            h = Hotspot.objects.create(
                host=host,
                name=f"{dist} Experience {i+1}",
                description=f"A wonderful experience in {dist} focusing on local culture and vibes.",
                short_description=f"Visit {dist} now!",
                district=dist,
                status=Hotspot.Status.Live,
                sensitivity_level=Hotspot.Sensitivity.Public,
                duration_minutes=random.choice([60, 120, 180]),
                operating_hours="09:00 - 18:00",
                tags=random.sample(tags_pool, 3),
                approx_travel_time_min=random.randint(15, 60),
                distance_band=random.choice(['NEAR', 'MEDIUM', 'FAR']),
                nearest_transport_hub_name=f"{dist} Bus Stand",
                nearest_transport_hub_type='BUS_STAND'
            )
            print(f"Created: {h.name} ({h.tags})")

print("Seeding Complete.")
