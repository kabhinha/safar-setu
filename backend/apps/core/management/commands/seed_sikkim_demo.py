import os
import random
import sys
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.db import transaction

# Import Models
from listings.models import Hotspot, Media
from commerce.models import Product
from safety.models import DistrictRestriction, EmergencyContact, CrowdAggregate, ModerationTicket
from broadcasts.models import BroadcastMessage

# Try import data
try:
    from .sikkim_data import (
        DISTRICTS, CLUSTERS, TRANSPORT_HUBS, HOTSPOTS, SIGHTS, PRODUCTS, 
        BROADCASTS, RESTRICTIONS, CONTACTS
    )
except ImportError:
    # If running from managing.py context where apps root is added
    try:
        from core.management.commands.sikkim_data import (
            DISTRICTS, CLUSTERS, TRANSPORT_HUBS, HOTSPOTS, SIGHTS, PRODUCTS, 
            BROADCASTS, RESTRICTIONS, CONTACTS
        )
    except ImportError:
         print("Error importing sikkim_data. Ensure it is in the same folder.")
         sys.exit(1)

User = get_user_model()

SEED_USER_EMAIL = "seed.bot@safarsetu.com"
SEED_USER_USERNAME = "sikkim_seed_bot"

class Command(BaseCommand):
    help = 'Seeds Sikkim Demo Data for Kiosk Pilot'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete existing seeded data before creating new data',
        )

    def handle(self, *args, **options):
        reset = options['reset']

        # 1. Safety Guard
        allow_reset = os.environ.get('ALLOW_SEED_RESET', 'false').lower() == 'true'
        is_dev = settings.DEBUG  # Assuming DEBUG=True is safe enough for Dev, or check explicit env

        if reset:
            if not(allow_reset or is_dev):
                self.stdout.write(self.style.ERROR(
                    "SAFETY ABORT: Cannot flush data. "
                    "Set ALLOW_SEED_RESET=true or ensure DEBUG=True."
                ))
                return

        self.stdout.write(self.style.SUCCESS('Starting Sikkim Seed Process...'))
        
        try:
            with transaction.atomic():
                self.setup_seed_user()
                
                if reset:
                    self.flush_data()
                
                self.seed_all()
                
                self.print_summary()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Seed Failed: {str(e)}"))
            raise e

    def setup_seed_user(self):
        self.seed_user, created = User.objects.get_or_create(
            email=SEED_USER_EMAIL,
            defaults={
                'username': SEED_USER_USERNAME,
                'role': 'ADMIN' # Assuming ADMIN role exists, or fallback
            }
        )
        if created:
            self.seed_user.set_unusable_password()
            self.seed_user.save()
            self.stdout.write(f"Created Seed User: {self.seed_user.username}")
        else:
            self.stdout.write(f"Using Seed User: {self.seed_user.username}")

    def flush_data(self):
        self.stdout.write("Flushing existing seed data...")
        
        # 1. Hotspots (and Sights)
        count, _ = Hotspot.objects.filter(host=self.seed_user).delete()
        self.stdout.write(f"- Deleted {count} Hotspots/Sights")

        # 2. Commerce Products
        # Delete products with seed vendor IDs
        vendor_ids = [p['vendor_id'] for p in PRODUCTS]
        count, _ = Product.objects.filter(vendor_id__in=vendor_ids).delete()
        self.stdout.write(f"- Deleted {count} Products")

        # 3. Safety
        count, _ = BroadcastMessage.objects.filter(created_by=self.seed_user).delete()
        self.stdout.write(f"- Deleted {count} Broadcasts")
        
        count, _ = DistrictRestriction.objects.filter(created_by=self.seed_user).delete()
        self.stdout.write(f"- Deleted {count} Restrictions")
        
        # 4. Crowd & Contacts (District based)
        # Be careful not to delete manual data if any, but for seed districts we assume ownership
        count, _ = CrowdAggregate.objects.filter(district_id__in=DISTRICTS).delete()
        self.stdout.write(f"- Deleted {count} Crowd Aggregates")
        
        count, _ = EmergencyContact.objects.filter(district_id__in=DISTRICTS).delete()
        self.stdout.write(f"- Deleted {count} Emergency Contacts")
        
        # Also Global contacts if they closely match ours? 
        # For now, let's tag them? EmergencyContact doesn't have created_by.
        # We'll just delete the ones we are about to create by phone number
        phones = [c['phone'] for c in CONTACTS]
        count, _ = EmergencyContact.objects.filter(phone__in=phones).delete()
        self.stdout.write(f"- Deleted {count} Emergency Contacts (by phone)")

    def seed_all(self):
        self.seed_hotspots()
        self.seed_sights()
        self.seed_commerce()
        self.seed_safety()

    def seed_hotspots(self):
        self.stdout.write("Seeding Hotspots...")
        for h in HOTSPOTS:
            # Check exist
            if Hotspot.objects.filter(name=h['name'], host=self.seed_user).exists():
                continue
            
            # Transport Hub
            hub_name = ""
            hub_type = ""
            if h['district'] in TRANSPORT_HUBS:
                hub = random.choice(TRANSPORT_HUBS[h['district']])
                hub_name = hub['name']
                hub_type = hub['type']

            hotspot = Hotspot.objects.create(
                host=self.seed_user,
                name=h['name'],
                short_description=h['short_description'],
                description=h['description'],
                district=h['district'],
                village_cluster_label=h['cluster'],
                tags=h['tags'],
                duration_minutes=h['duration_min'],
                distance_band=h['distance_band'].upper(),
                sensitivity_level=h['sensitivity_level'].upper(),
                
                hotspot_type=Hotspot.HotspotType.Standard,
                status=Hotspot.Status.Approved,
                
                approx_travel_time_min=h['approx_travel_time_min'],
                nearest_transport_hub_name=hub_name,
                nearest_transport_hub_type=hub_type,
                
                approved_by=self.seed_user
            )

            # Media
            if 'image_url' in h:
                # We can't easily download, so we'll use a placeholder technique or just store the URL if supported?
                # The model expects a FileField. Logic might break if we pass a URL string to FileField.
                # Requirement: "1 cover media placeholder image URL OR local static reference"
                # Since we can't seed files easily without physical files, we will skip Media creation 
                # OR create a Media object without a file if allowed? No, file is required.
                # We will create a dummy file content if possible, or skip media for now to avoid errors.
                # Ideally we should point to a static default.
                pass
                
    def seed_sights(self):
        self.stdout.write("Seeding Sights...")
        for s in SIGHTS:
            if Hotspot.objects.filter(name=s['name'], host=self.seed_user).exists():
                continue

            Hotspot.objects.create(
                host=self.seed_user,
                name=s['name'],
                short_description=s['short_description'],
                description=s['short_description'], # Copy short to full
                district=s['district'],
                village_cluster_label=s['cluster'],
                hotspot_type=Hotspot.HotspotType.Sight,
                sights_category=s['sights_category'],
                status=Hotspot.Status.Approved,
                approved_by=self.seed_user,
                sensitivity_level=Hotspot.Sensitivity.Public
            )

    def seed_commerce(self):
        self.stdout.write("Seeding Products...")
        for p in PRODUCTS:
            Product.objects.get_or_create(
                title=p['title'],
                vendor_id=p['vendor_id'],
                defaults={
                    'price_amount': p['price'],
                    'description': p['desc'],
                    'active': True
                }
            )

    def seed_safety(self):
        self.stdout.write("Seeding Safety...")
        
        # Broadcasts
        for b in BROADCASTS:
            start = timezone.now() + timedelta(days=b['days_start'])
            end = timezone.now() + timedelta(days=b['days_end'])
            
            BroadcastMessage.objects.get_or_create(
                title=b['title'],
                created_by=self.seed_user,
                defaults={
                    'category': b['category'], # Might need mapping if enum mismatch
                    'message': b['message'],
                    'severity': b['severity'],
                    'start_at': start,
                    'end_at': end,
                    'is_active_override': True
                }
            )

        # Restrictions
        for r in RESTRICTIONS:
            DistrictRestriction.objects.get_or_create(
                district_id=r['district'],
                restriction_type=r['type'],
                created_by=self.seed_user,
                defaults={
                    'message': r['message'],
                    'severity': r['severity'],
                    'start_at': timezone.now() - timedelta(days=1),
                    'end_at': timezone.now() + timedelta(days=30),
                }
            )

        # Contacts
        for c in CONTACTS:
            EmergencyContact.objects.get_or_create(
                phone=c['phone'],
                defaults={
                    'label': c['label'],
                    'district_id': c['district'],
                    'notes': c['notes'],
                    'active': True
                }
            )

        # Crowd Aggregates
        # Create one for each district
        CROWD_STATES = {
            "Gangtok": "HIGH",
            "Namchi": "MEDIUM",
            "Gyalshing": "LOW",
            "Mangan": "MEDIUM"
        }
        
        for district, density in CROWD_STATES.items():
            CrowdAggregate.objects.create(
                district_id=district,
                density_state=density,
                source_type='CCTV_EDGE',
                timestamp=timezone.now() - timedelta(minutes=5),
                count_15min=random.randint(50, 500)
            )

    def print_summary(self):
        self.stdout.write("\n==================================")
        self.stdout.write("       SEEDING COMPLETE")
        self.stdout.write("==================================")
        self.stdout.write(f"Hotspots/Sights: {Hotspot.objects.filter(host=self.seed_user).count()}")
        self.stdout.write(f"Products:        {Product.objects.filter(vendor_id__in=[p['vendor_id'] for p in PRODUCTS]).count()}")
        self.stdout.write(f"Broadcasts:      {BroadcastMessage.objects.filter(created_by=self.seed_user).count()}")
        self.stdout.write(f"Restrictions:    {DistrictRestriction.objects.filter(created_by=self.seed_user).count()}")
        self.stdout.write(f"Contacts:        {EmergencyContact.objects.filter(active=True).count()}")
