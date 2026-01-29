from django.core.management.base import BaseCommand
from listings.models import Hotspot
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial Kiosk travel experiences'

    def handle(self, *args, **kwargs):
        # Ensure a host exists
        host, _ = User.objects.get_or_create(username='kiosk_host', defaults={'email': 'host@kiosk.com', 'role': 'HOST'})
        
        experiences = [
            {
                "name": "Sunrise Tea Plantation Walk",
                "description": "A guided walk through the heritage tea gardens followed by tasting.",
                "duration": 60,
                "tags": ["tea", "nature", "quiet"],
                "district": "Jorhat"
            },
            {
                "name": "Local Handicraft Center",
                "description": "Watch artisans create bamboo crafts and try it yourself.",
                "duration": 30,
                "tags": ["crafts", "shopping"],
                "district": "Majuli"
            },
            {
                "name": "Wetlands Bird Watching",
                "description": "Silent boat ride to spot warm-climate migratory birds.",
                "duration": 120,
                "tags": ["nature", "wetlands", "quiet"],
                "district": "Kaziranga"
            },
            {
                "name": "Heritage Temple Visit",
                "description": "Explore the ancient architecture and history.",
                "duration": 45,
                "tags": ["history", "quiet"],
                "district": "Sivasagar"
            },
            {
                "name": "Traditional Assamese Thali",
                "description": "Enjoy an authentic local meal prepared by the community.",
                "duration": 60,
                "tags": ["food", "culture"],
                "district": "Guwahati"
            }
        ]

        for exp in experiences:
            h, created = Hotspot.objects.update_or_create(
                name=exp['name'],
                defaults={
                    'host': host,
                    'description': exp['description'],
                    'duration_minutes': exp['duration'],
                    'tags': exp['tags'],
                    'district': exp['district'],
                    'status': Hotspot.Status.Approved
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created {h.name}'))
            else:
                self.stdout.write(f'Updated {h.name}')
                
        self.stdout.write(self.style.SUCCESS('Seeding Complete'))
