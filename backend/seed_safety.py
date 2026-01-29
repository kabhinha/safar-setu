import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent / 'apps'))
django.setup()

from broadcasts.models import BroadcastMessage
from safety.models import CrowdAggregate, DistrictRestriction, EmergencyContact
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    print("Seeding Safety & Broadcast data...")
    
    # Ensure a user exists for 'created_by'
    admin_user = User.objects.first()
    if not admin_user:
        print("No user found, creating temp admin...")
        admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')

    now = timezone.now()
    
    # 1. Broadcasts
    print("Creating Broadcasts...")
    BroadcastMessage.objects.all().delete()
    
    BroadcastMessage.objects.create(
        category=BroadcastMessage.Category.FESTIVAL,
        title="Spring Festival 2026",
        message="The annual Spring Festival is ongoing in the Central District. Expect traffic delays.",
        severity=BroadcastMessage.Severity.INFO,
        start_at=now - timedelta(days=1),
        end_at=now + timedelta(days=5),
        is_active_override=True,
        created_by=admin_user
    )
    
    BroadcastMessage.objects.create(
        category=BroadcastMessage.Category.ROUTE_CLOSURE,
        title="Main Bridge Maintenance",
        message="The Old Bridge is closed for scheduled maintenance. Use the bypass.",
        severity=BroadcastMessage.Severity.WARNING,
        start_at=now - timedelta(hours=12),
        end_at=now + timedelta(hours=36),
        is_active_override=True,
        created_by=admin_user
    )
    
    BroadcastMessage.objects.create(
        category=BroadcastMessage.Category.ADVISORY,
        title="Heavy Rain Forecast",
        message="Heavy rains expected in the Northern Hills. Avoid trekking.",
        severity=BroadcastMessage.Severity.CRITICAL,
        start_at=now,
        end_at=now + timedelta(hours=24),
        is_active_override=True,
        created_by=admin_user
    )

    # 2. Crowd Aggregates
    print("Creating Crowd Aggregates...")
    # CrowdAggregate.objects.all().delete() # Optional: keep history
    
    CrowdAggregate.objects.create(
        district_id="dist_001",
        density_state=CrowdAggregate.DensityState.MEDIUM,
        count_15min=150,
        timestamp=now,
        source_type=CrowdAggregate.SourceType.CCTV_EDGE
    )
    
    # 3. Restrictions
    print("Creating Restrictions...")
    DistrictRestriction.objects.all().delete()
    
    DistrictRestriction.objects.create(
        district_id="dist_001",
        restriction_type=DistrictRestriction.RestrictionType.WETLAND,
        message="Wetland entry requires a permit during breeding season.",
        severity=DistrictRestriction.Severity.WARNING,
        start_at=now - timedelta(days=10),
        end_at=now + timedelta(days=20),
        created_by=admin_user
    )

    # 4. Emergency Contacts
    print("Creating Emergency Contacts...")
    EmergencyContact.objects.all().delete()
    
    EmergencyContact.objects.create(
        district_id="dist_001",
        label="Police Control Room",
        phone="112",
        active=True
    )
    
    EmergencyContact.objects.create(
        district_id="dist_001",
        label="Tourism Helpline",
        phone="+91-9876543210",
        notes="24x7 Support",
        active=True
    )
    
    print("Done!")

if __name__ == '__main__':
    seed()
