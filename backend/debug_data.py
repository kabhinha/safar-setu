import os
import django
import sys

# Setup Django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from listings.models import Hotspot

print("--- DIAGNOSTICS START ---")
print(f"Total Hotspots: {Hotspot.objects.count()}")
print(f"Live Hotspots: {Hotspot.objects.filter(status=Hotspot.Status.Live).count()}")
guwahati_qs = Hotspot.objects.filter(district__iexact='Guwahati')
print(f"Guwahati Total: {guwahati_qs.count()}")
print(f"Guwahati Live: {guwahati_qs.filter(status=Hotspot.Status.Live).count()}")

for h in guwahati_qs:
    print(f" - {h.name}: Status={h.status}, Duration={h.duration_minutes}, Tags={h.tags}")

print("--- DIAGNOSTICS END ---")
