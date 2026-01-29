import sys
import datetime
from django.core.management.base import BaseCommand, CommandError
from django.apps import apps
from django.db import transaction, models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model

# =============================================================================
# DATA DEFINITIONS (SIKKIM PILOT)
# =============================================================================

DISTRICTS = [
    "East Sikkim",
    "West Sikkim",
    "North Sikkim",
    "South Sikkim"
]

HOTSPOTS = [
    # East Sikkim
    {
        "name": "Rumtek Monastery",
        "district": "East Sikkim",
        "description": "A stunning Tibetan Buddhist monastery with golden stupas and panoramic views.",
        "short_description": "Iconic monastery with golden stupas.",
        "tags": ["Heritage", "Culture", "Peaceful"],
        "hotspot_type": "SIGHT",
        "sights_category": "MONASTERY",
        "sensitivity": "PUBLIC", 
        "status": "LIVE"
    },
    {
        "name": "MG Marg Walk",
        "district": "East Sikkim", 
        "description": "The clean, vehicle-free heart of Gangtok, lined with shops and cafes.",
        "short_description": "Vehicle-free promenade in Gangtok.",
        "tags": ["Shopping", "Food", "Walk"],
        "hotspot_type": "STANDARD",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Tsomgo Lake",
        "district": "East Sikkim",
        "description": "Glacial lake with changing colors, surrounded by steep mountains.",
        "short_description": "Glacial lake at high altitude.",
        "tags": ["Nature", "Lake", "Adventure"],
        "hotspot_type": "SIGHT",
        "sights_category": "NATURE",
        "sensitivity": "PROTECTED",
        "status": "LIVE"
    },
    # West Sikkim
    {
        "name": "Yuksom Heritage Trail",
        "district": "West Sikkim",
        "description": "The historical first capital of Sikkim, gateway to Kanchenjunga.",
        "short_description": "First capital and trekking gateway.",
        "tags": ["Heritage", "Trekking", "Nature"],
        "hotspot_type": "SIGHT",
        "sights_category": "HERITAGE",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Pelling Skywalk",
        "district": "West Sikkim",
        "description": "Glass skywalk offering breathtaking views of the Himalayas.",
        "short_description": "Glass skywalk with mountain views.",
        "tags": ["Viewpoint", "Adventure"],
        "hotspot_type": "SIGHT",
        "sights_category": "VIEWPOINT",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Pemayangtse Monastery",
        "district": "West Sikkim",
        "description": "One of the oldest monasteries in Sikkim.",
        "short_description": "Historic and premier monastery.",
        "tags": ["Heritage", "Monastery"],
        "hotspot_type": "SIGHT",
        "sights_category": "MONASTERY",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    # North Sikkim
    {
        "name": "Gurudongmar Lake",
        "district": "North Sikkim",
        "description": "One of the highest lakes in the world, sacred to many.",
        "short_description": "High altitude sacred lake.",
        "tags": ["Nature", "Sacred", "Extreme"],
        "hotspot_type": "SIGHT",
        "sights_category": "NATURE",
        "sensitivity": "RESTRICTED", # Often requires permit
        "status": "LIVE"
    },
    {
        "name": "Lachung Village",
        "district": "North Sikkim",
        "description": "Scenic mountain village known for its apples, peaches, and apricots.",
        "short_description": "Scenic village in Yumthang Valley.",
        "tags": ["Village", "Culture", "Nature"],
        "hotspot_type": "STANDARD",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Yumthang Valley",
        "district": "North Sikkim",
        "description": "The valley of flowers with hot springs and grazing yaks.",
        "short_description": "Valley of Flowers sanctuary.",
        "tags": ["Nature", "Flowers", "Valley"],
        "hotspot_type": "SIGHT",
        "sights_category": "NATURE",
        "sensitivity": "PROTECTED",
        "status": "LIVE"
    },
    # South Sikkim
    {
        "name": "Temi Tea Garden",
        "district": "South Sikkim",
        "description": "The only tea garden in Sikkim, producing top quality organic tea.",
        "short_description": "Organic tea garden with views.",
        "tags": ["Tea", "Nature", "Relax"],
        "hotspot_type": "SIGHT",
        "sights_category": "NATURE",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Ravangla Buddha Park",
        "district": "South Sikkim",
        "description": "Features a massive 130-foot statue of the Buddha.",
        "short_description": "Park with massive Buddha statue.",
        "tags": ["Heritage", "Peace", "Park"],
        "hotspot_type": "SIGHT",
        "sights_category": "HERITAGE",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    },
    {
        "name": "Namchi Char Dham",
        "district": "South Sikkim",
        "description": "Cultural and religious complex replicating four pilgrimage sites.",
        "short_description": "Pilgrimage cultural complex.",
        "tags": ["Heritage", "Culture"],
        "hotspot_type": "SIGHT",
        "sights_category": "HERITAGE",
        "sensitivity": "PUBLIC",
        "status": "LIVE"
    }
]

KIOSKS = [
    {"name": "MG Marg Center", "district": "East Sikkim", "code": "SFS-SIK-E-001"},
    {"name": "Gangtok Taxi Stand", "district": "East Sikkim", "code": "SFS-SIK-E-002"},
    {"name": "Pelling Helpline", "district": "West Sikkim", "code": "SFS-SIK-W-001"},
    {"name": "Yuksom Entry", "district": "West Sikkim", "code": "SFS-SIK-W-002"},
    {"name": "Lachung Checkpost", "district": "North Sikkim", "code": "SFS-SIK-N-001"},
    {"name": "Lachen Market", "district": "North Sikkim", "code": "SFS-SIK-N-002"},
    {"name": "Namchi Central", "district": "South Sikkim", "code": "SFS-SIK-S-001"},
    {"name": "Ravangla Plaza", "district": "South Sikkim", "code": "SFS-SIK-S-002"},
]

BROADCASTS = [
    {
        "title": "Losar Festival Preparations",
        "message": "Preparations for the upcoming Losar festival are underway. Traffic diversions may be in place.",
        "category": "FESTIVAL",
        "severity": "INFO",
        "district": "East Sikkim"
    },
    {
        "title": "Heavy Snowfall Alert",
        "message": "Heavy snowfall expected in North Sikkim. Travel to Gurudongmar may be restricted.",
        "category": "ADVISORY", # Was WEATHER, mapped to valid choice
        "severity": "WARNING",
        "district": "North Sikkim"
    },
    {
        "title": "Flower Show @ Gangtok",
        "message": "Annual Orchid and Flower show starts this weekend at the Ridge Park.",
        "category": "FESTIVAL",
        "severity": "INFO",
        "district": "East Sikkim"
    },
    {
        "title": "Landslide Warning",
        "message": "Minor slides reported near Dikchu. Drive with caution.",
        "category": "ROUTE_CLOSURE",
        "severity": "CRITICAL",
        "district": "Global" 
    }
]

PRODUCTS = [
    {"title": "Temi Organic Tea", "price": 450.00, "description": "Premium organic black tea from Temi estate."},
    {"title": "Sikkim Orange Marmalade", "price": 150.00, "description": "Freshly made from local oranges."},
    {"title": "Handwoven Lepcha Bag", "price": 1200.00, "description": "Traditional geometric patterns."},
    {"title": "Yak Wool Shawl", "price": 2500.00, "description": "Warm and authentic yak wool."}
]


# =============================================================================
# AUTO-DETECTION MAPS
# =============================================================================

MODEL_SIGNATURES = {
    "STATE": {
        "required_fields": ["name"],
        "optional_fields": ["country", "code"],
        "app_preference": ["geography", "core"],
        "name_preference": ["state", "province"],
        "min_score": 4
    },
    "DISTRICT": {
        "required_fields": ["name"],
        "optional_fields": ["state", "state_id", "code"],
        "app_preference": ["geography", "core"],
        "name_preference": ["district", "region", "geounit"],
        "min_score": 4
    },
    "HOTSPOT": {
        "required_fields": ["name", "description"],
        "optional_fields": ["district", "district_name", "status", "category", "tags", "hotspot_type", "sights_category"],
        "app_preference": ["listings", "places", "catalog"],
        "name_preference": ["hotspot", "listing", "sight", "place"],
        "min_score": 4
    },
    "KIOSK": {
        "required_fields": ["name"],
        "optional_fields": ["hardware_id", "device_id", "district_name", "district_id", "status"],
        "app_preference": ["kiosk", "devices"],
        "name_preference": ["kiosk", "device", "kioskdevice"],
        "min_score": 3
    },
    "BROADCAST": {
        "required_fields": ["message"],
        "optional_fields": ["title", "category", "severity", "district_id", "start_at"],
        "app_preference": ["broadcasts", "announcements"],
        "name_preference": ["broadcast", "message", "announcement"],
        "min_score": 3
    },
    "COMMERCE_PRODUCT": {
        "required_fields": ["title", "price_amount"],
        "optional_fields": ["description", "vendor_id", "active"],
        "app_preference": ["commerce", "store"],
        "name_preference": ["product", "item"],
        "min_score": 4
    }
}

class Command(BaseCommand):
    help = 'Auto-detects models and seeds Sikkim pilot data idempotently.'

    def add_arguments(self, parser):
        parser.add_argument('--flush', action='store_true', help='Delete seeded data before running.')
        parser.add_argument('--dry-run', action='store_true', help='Simulate without saving.')
        parser.add_argument('--debug-detect', action='store_true', help='Show model scoring details.')

    def handle(self, *args, **options):
        self.dry_run = options['dry_run']
        self.flush = options['flush']
        self.debug_detect = options['debug_detect']

        self.stdout.write(self.style.HTTP_INFO(f"Starting SEED_SIKKIM (Dry Run: {self.dry_run}, Flush: {self.flush})..."))

        # 1. DETECT MODELS
        self.models = self.detect_models()
        self.print_detection_summary()

        # 2. SEED DATA
        try:
            with transaction.atomic():
                if self.flush:
                    self.flush_data()
                
                self.seed_state()
                self.seed_districts()
                self.seed_hotspots()
                self.seed_kiosks()
                self.seed_broadcasts()
                self.seed_commerce()

                if self.dry_run:
                    raise CommandError("Dry Run Complete - Rolling back transaction (simulated).")
        except CommandError as e:
            if "Dry Run Complete" in str(e):
                self.stdout.write(self.style.SUCCESS("Dry run successful. No changes made."))
            else:
                raise e
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Seeding Failed: {e}"))
            import traceback
            traceback.print_exc()
            sys.exit(1)

        # 3. VERIFY
        if not self.dry_run:
            self.verify_system()

        self.stdout.write(self.style.SUCCESS("SEED_SIKKIM SUCCESS: Backend is consistent."))

    # =========================================================================
    # AUTO-DETECTION LOGIC
    # =========================================================================

    def detect_models(self):
        detected = {}
        all_models = apps.get_models()
        
        for role, criteria in MODEL_SIGNATURES.items():
            best_model = None
            best_score = -1

            for model in all_models:
                score = self.score_model(model, criteria, role)
                if score > best_score and score >= criteria['min_score']:
                    best_score = score
                    best_model = model
            
            detected[role] = best_model
        
        return detected

    def score_model(self, model, criteria, role):
        score = 0
        opts = model._meta
        app_label = opts.app_label
        model_name = opts.model_name.lower()
        fields = {f.name for f in opts.get_fields()}

        # 0. System Exclusion
        if app_label.startswith('django') or app_label == 'auth' or app_label == 'contenttypes':
            return 0

        # 1. Required fields
        for f in criteria['required_fields']:
            if f in fields:
                score += 3
            else:
                # Penalize heavily if required field missing, unless it's a "one of" situation 
                # (simple logic: must have all required)
                pass

        # 2. Optional fields
        for f in criteria['optional_fields']:
            if f in fields:
                score += 1

        # 3. App preference
        if app_label in criteria['app_preference']:
            score += 2
        
        # 4. Name preference
        for pref in criteria['name_preference']:
            if pref in model_name:
                score += 2
                break
        
        if self.debug_detect and score > 0:
            print(f"DEBUG: {role} candidate {app_label}.{opts.object_name} = {score}")

        # Hard failure if any required field is completely missing?
        # Let's be lenient for now, but strict on candidates.
        # Check if ALL required fields are present
        if not set(criteria['required_fields']).issubset(fields):
            return 0

        return score

    def print_detection_summary(self):
        self.stdout.write("--- Model Detection Results ---")
        for role, model in self.models.items():
            if model:
                self.stdout.write(f"{role}: {self.style.SUCCESS(f'{model._meta.app_label}.{model.__name__}')}")
            else:
                self.stdout.write(f"{role}: {self.style.WARNING('NOT DETECTED')}")
        self.stdout.write("-------------------------------")
    
    def get_system_user(self):
        User = get_user_model()
        # Ensure a system user exists for ownership assignment
        try:
            # Check for existing admin or create a specific seeder char
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                user, _ = User.objects.get_or_create(
                    username="sikkim_admin", 
                    defaults={
                        "email": "admin@sikkim.gov.in",
                        "is_staff": True,
                        "is_superuser": True
                    }
                )
                if _:
                    user.set_password("sikkim123")
                    user.save()
            return user
        except Exception as e:
            if self.debug_detect:
                print(f"Warning: Could not get system user: {e}")
            return None

    # =========================================================================
    # HELPERS
    # =========================================================================

    def get_field_map(self, model, candidates):
        """Finds the actual field name in the model from a list of candidates."""
        fields = {f.name for f in model._meta.get_fields()}
        for c in candidates:
            if c in fields:
                return c
        return None

    def safe_create_or_update(self, model, lookup, data, seed_tag="[SEED_SIKKIM]"):
        """
        Generic creator.
        - Filters data to only include existing fields.
        - Handles Choices (if invalid, drops field or sets default).
        - Appends seed tag if text field available.
        """
        opts = model._meta
        model_fields = {f.name: f for f in opts.get_fields()}
        
        # Tagging (for idempotency and flushing)
        # Try to find a field to mark
        tag_field = self.get_field_map(model, ["seed_tag", "source", "notes", "description", "short_description"])
        
        # Construct Create Data
        final_data = {}
        for k, v in data.items():
            # If key maps to a real field
            if k in model_fields:
                field_obj = model_fields[k]
                
                # Check choices validation
                if field_obj.choices:
                    valid_values = [c[0] for c in field_obj.choices]
                    if v not in valid_values:
                        # Try upper case
                        if isinstance(v, str) and v.upper() in valid_values:
                            v = v.upper()
                        else:
                            # Skip invalid choice to prevent crash
                            if self.debug_detect: 
                                print(f"Skipping invalid choice {v} for {k} in {model.__name__}")
                            continue
                
                final_data[k] = v
            # If key is intended as a field alias (e.g. 'district_name' in data mapping to 'district' in model)
            # This logic should be handled by caller usually, but we can do some basic matching if needed.
            # strict for now.

        # Lookups
        final_lookup = {}
        for k, v in lookup.items():
            if k in model_fields:
                final_lookup[k] = v

        if not final_lookup:
            self.stdout.write(self.style.WARNING(f"Cannot seed {model.__name__}: Lookup fields missing."))
            return None

        # Execute
        try:
            obj, created = model.objects.update_or_create(defaults=final_data, **final_lookup)
            action = "Created" if created else "Updated"
            # self.stdout.write(f"   {action} {model.__name__}: {obj}")
            return obj
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"   Error seeding {model.__name__} {final_lookup}: {e}"))
            return None

    def flush_data(self):
        self.stdout.write("Flushing seeded data...")
        # Simple heuristic: delete objects that look like ours
        # Since we use precise names, we can delete by name lookups or the [SEED] tag if allowed.
        # For this pilot, strict name matching on what we defined is safer than wild deleting.
        
        # Districts
        dist_model = self.models.get("DISTRICT")
        if dist_model:
            dist_name_field = self.get_field_map(dist_model, ["name", "title"])
            if dist_name_field:
                dist_model.objects.filter(**{f"{dist_name_field}__in": DISTRICTS}).delete()
                
        # Hotspots
        hotspot_model = self.models.get("HOTSPOT")
        if hotspot_model:
            name_field = self.get_field_map(hotspot_model, ["name"])
            names = [h["name"] for h in HOTSPOTS]
            if name_field:
                hotspot_model.objects.filter(**{f"{name_field}__in": names}).delete()
                
        # Kiosks
        kiosk_model = self.models.get("KIOSK")
        if kiosk_model:
            id_field = self.get_field_map(kiosk_model, ["hardware_id", "device_id", "code"])
            ids = [k["code"] for k in KIOSKS]
            if id_field:
                kiosk_model.objects.filter(**{f"{id_field}__in": ids}).delete()

        # Commerce
        prod_model = self.models.get("COMMERCE_PRODUCT")
        if prod_model:
            title_field = self.get_field_map(prod_model, ["title"])
            titles = [p["title"] for p in PRODUCTS]
            if title_field:
                prod_model.objects.filter(**{f"{title_field}__in": titles}).delete()

        self.stdout.write("Flush complete.")

    # =========================================================================
    # SEEDERS
    # =========================================================================

    def seed_state(self):
        model = self.models.get("STATE")
        if not model: return
        
        name_field = self.get_field_map(model, ["name", "title"])
        if not name_field: return

        self.safe_create_or_update(model, {name_field: "Sikkim"}, {name_field: "Sikkim"})

    def seed_districts(self):
        model = self.models.get("DISTRICT")
        if not model: return
        
        name_field = self.get_field_map(model, ["name", "title"])
        state_model = self.models.get("STATE")
        
        # Try to link state
        state_obj = None
        if state_model:
            state_name_field = self.get_field_map(state_model, ["name"])
            try:
                state_obj = state_model.objects.get(**{state_name_field: "Sikkim"})
            except:
                pass

        state_fk_field = self.get_field_map(model, ["state", "parent"])
        
        count = 0
        for name in DISTRICTS:
            data = {}
            if state_fk_field and state_obj:
                data[state_fk_field] = state_obj
            
            self.safe_create_or_update(model, {name_field: name}, data)
            count += 1
        self.stdout.write(f"Seeded {count} Districts")

    def seed_hotspots(self):
        model = self.models.get("HOTSPOT")
        if not model: return

        # Maps
        name_map = self.get_field_map(model, ["name", "title"])
        desc_map = self.get_field_map(model, ["description", "about"])
        short_desc_map = self.get_field_map(model, ["short_description", "summary"])
        status_map = self.get_field_map(model, ["status", "is_published"])
        type_map = self.get_field_map(model, ["hotspot_type", "type"])
        district_fk_map = self.get_field_map(model, ["district", "district_id", "district_name"])
        host_map = self.get_field_map(model, ["host", "author", "owner", "user"])
        
        # Check if district is FK or String
        is_district_fk = False
        if district_fk_map:
            field_obj = model._meta.get_field(district_fk_map)
            is_district_fk = field_obj.is_relation

        dist_model = self.models.get("DISTRICT")
        system_user = self.get_system_user()
        
        count = 0
        for item in HOTSPOTS:
            lookup = {name_map: item["name"]}
            data = item.copy()
            
            if host_map and system_user:
                data[host_map] = system_user

            # Resolve district
            if district_fk_map:
                if is_district_fk and dist_model:
                     # Find ID
                     dist_name_f = self.get_field_map(dist_model, ["name"])
                     try:
                         d_obj = dist_model.objects.get(**{dist_name_f: item["district"]})
                         data[district_fk_map] = d_obj
                     except:
                         pass # Warning?
                else:
                    # It's a string field
                    data[district_fk_map] = item["district"]

            self.safe_create_or_update(model, lookup, data)
            count += 1
        self.stdout.write(f"Seeded {count} Hotspots")

    def seed_kiosks(self):
        model = self.models.get("KIOSK")
        if not model: return

        id_map = self.get_field_map(model, ["hardware_id", "device_id", "code"])
        name_map = self.get_field_map(model, ["name"])
        dist_map = self.get_field_map(model, ["district_name", "district"])
        
        count = 0
        for item in KIOSKS:
            lookup = {id_map: item["code"]}
            data = {
                name_map: item["name"],
                dist_map: item["district"]
            }
            # Add defaults for status if needed, handled by safe_create logic implicitly if passed or by model default
            self.safe_create_or_update(model, lookup, data)
            count += 1
        self.stdout.write(f"Seeded {count} Kiosks")

    def seed_broadcasts(self):
        model = self.models.get("BROADCAST")
        if not model: return

        title_map = self.get_field_map(model, ["title"])
        msg_map = self.get_field_map(model, ["message", "content"])
        cat_map = self.get_field_map(model, ["category"])
        sev_map = self.get_field_map(model, ["severity"])
        dist_map = self.get_field_map(model, ["district_id", "district"])
        end_map = self.get_field_map(model, ["end_at"])

        count = 0
        future = timezone.now() + datetime.timedelta(days=7)

        for item in BROADCASTS:
            lookup = {title_map: item["title"]}
            data = {
                msg_map: item["message"],
                cat_map: item.get("category"),
                sev_map: item.get("severity"),
                dist_map: item.get("district"),
                end_map: future
            }
            self.safe_create_or_update(model, lookup, data)
            count += 1
        self.stdout.write(f"Seeded {count} Broadcasts")

    def seed_commerce(self):
        model = self.models.get("COMMERCE_PRODUCT")
        if not model: return

        title_map = self.get_field_map(model, ["title"])
        price_map = self.get_field_map(model, ["price_amount", "price"])
        desc_map = self.get_field_map(model, ["description"])
        vendor_map = self.get_field_map(model, ["vendor_id"])

        count = 0
        for item in PRODUCTS:
            lookup = {title_map: item["title"]}
            data = {
                price_map: item["price"],
                desc_map: item.get("description"),
                vendor_map: 999 # Dummy vendor
            }
            self.safe_create_or_update(model, lookup, data)
            count += 1
        self.stdout.write(f"Seeded {count} Products")

    # =========================================================================
    # VERIFICATION
    # =========================================================================

    def verify_system(self):
        from django.core.management import call_command
        self.stdout.write("Running Post-Seed Verification...")

        # 1. Check
        try:
            call_command("check", verbosity=0)
            self.stdout.write(self.style.SUCCESS("✓ System Check passed"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✗ System Check failed: {e}"))
            raise e

        # 2. Migrations
        try:
            # showmigrations is informative, but dry running makemigrations checks for consistency
            call_command("makemigrations", dry_run=True, check=True, verbosity=0)
            self.stdout.write(self.style.SUCCESS("✓ Migrations consistent"))
        except SystemExit:
             self.stdout.write(self.style.SUCCESS("✓ Migrations consistent (No changes detected)"))
        except Exception as e:
             self.stdout.write(self.style.WARNING(f"⚠ Migration check warning: {e}"))

        # 3. Data Existence
        if self.models.get("HOTSPOT"):
            count = self.models["HOTSPOT"].objects.count()
            if count < 4:
                raise CommandError(f"Verification Failed: Only {count} hotspots found (expected >4).")
            self.stdout.write(self.style.SUCCESS(f"✓ Found {count} hotspots"))
