from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from listings.models import Hotspot

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds Kiosk Sights for Demo'

    def handle(self, *args, **options):
        # Ensure a host exists
        host, created = User.objects.get_or_create(username='sights_admin_demo', defaults={'email': 'admin@sikkim.gov', 'is_staff': True})
        if created:
            host.set_password('demo123')
            host.save()
            self.stdout.write("Created host user: sights_admin_demo")
        else:
            host = User.objects.get(username='sights_admin_demo')

        # Clear existing sights to avoid dupes (optional, but good for demo reset)
        # Hotspot.objects.filter(hotspot_type=Hotspot.HotspotType.Sight).delete()

        sights_data = [
            {
                "name": "Rumtek Monastery",
                "short_description": "The largest monastery in Sikkim, home to the Black Hat sect.",
                "description": "Rumtek Monastery, also called the Dharmachakra Centre, is a gompa located in the Indian state of Sikkim near Gangtok. It is a focal point for the sectarian tensions that characterize the Karma Kagyu school of Tibetan Buddhism.",
                "district": "Gangtok",
                "village_cluster_label": "Rumtek Cluster",
                "sights_category": Hotspot.SightsCategory.Monastery,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            },
            {
                "name": "Pemayangtse Monastery",
                "short_description": "One of the oldest monasteries in Sikkim, offering views of Mt. Kanchenjunga.",
                "description": "Pemayangtse Monastery is a Buddhist monastery in Pemayangtse, near Pelling in the northeastern Indian state of Sikkim, located 140 kilometres west of Gangtok.",
                "district": "Geyzing",
                "village_cluster_label": "Pelling Cluster",
                "sights_category": Hotspot.SightsCategory.Monastery,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            },
            {
                "name": "Tashi Viewpoint",
                "short_description": "Famous for sunrise views over Mt. Kanchenjunga.",
                "description": "Tashi Viewpoint is a scenic spot located 8 km from Gangtok. It offers a sweeping view of the Kanchenjunga snow peaks on a clear day.",
                "district": "Gangtok",
                "village_cluster_label": "Gangtok Outskirts",
                "sights_category": Hotspot.SightsCategory.Viewpoint,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            },
            {
                "name": "Ganesh Tok",
                "short_description": "A small temple dedicated to Lord Ganesha with a panoramic view.",
                "description": "Ganesh Tok is a small temple dedicated to Lord Ganesha located on a hill near the Tashi View Point.",
                "district": "Gangtok",
                "village_cluster_label": "Gangtok Outskirts",
                "sights_category": Hotspot.SightsCategory.Viewpoint,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            },
            {
                "name": "Khecheopalri Lake",
                "short_description": "A sacred lake for both Buddhists and Hindus, believed to wish fulfilling.",
                "description": "Khecheopalri Lake, originally known as Kha-Chot-Palri (meaning the mountain of blissful heaven), is a lake located near Khecheopalri village, 147 kilometres (91 mi) west of Gangtok in the West Sikkim district.",
                "district": "Geyzing",
                "village_cluster_label": "Khecheopalri Cluster",
                "sights_category": Hotspot.SightsCategory.Nature,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            },
            {
                "name": "Rabdentse Ruins",
                "short_description": "The ruins of the second capital of the former Kingdom of Sikkim.",
                "description": "Rabdentse was the second capital of the former Kingdom of Sikkim from 1670 to 1814. The capital city was destroyed by the invading Gurkha army and only the ruins of the palace and the chortens can be seen now.",
                "district": "Geyzing",
                "village_cluster_label": "Pelling Cluster",
                "sights_category": Hotspot.SightsCategory.Heritage,
                "hotspot_type": Hotspot.HotspotType.Sight,
                "status": Hotspot.Status.Live
            }
        ]

        count = 0
        for data in sights_data:
            # Check if exists by name
            if not Hotspot.objects.filter(name=data['name']).exists():
                Hotspot.objects.create(host=host, **data)
                count += 1
                self.stdout.write(f"Created: {data['name']}")
            else:
                self.stdout.write(f"Skipped (exists): {data['name']}")
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new Sight(s).'))
