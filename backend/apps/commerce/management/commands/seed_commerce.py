from django.core.management.base import BaseCommand
from commerce.models import Product

class Command(BaseCommand):
    help = 'Seeds duplicate demo products for Kiosk Mart'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Commerce Products...')
        
        # Clear existing demo products to avoid duplicates if re-run often
        # (Optional: limit to specific vendor_id if we want to be safe)
        Product.objects.filter(vendor_id=999).delete()

        products = [
            {
                "title": "Sikkim Tea (Organic)",
                "description": "Premium organic Temi tea from the hills of Sikkim.",
                "price": 450.00,
                "vendor_id": 999
            },
            {
                "title": "Handwoven Lepcha Bag",
                "description": "Traditional handwoven bag with distinct geometric patterns.",
                "price": 1200.00,
                "vendor_id": 999
            },
            {
                "title": "Churpi (Local Cheese)",
                "description": "Hardened traditional cheese, a popular local snack.",
                "price": 200.00,
                "vendor_id": 999
            },
            {
                "title": "Buddhist Prayer Flags",
                "description": "Set of 5 cotton prayer flags for peace and prosperity.",
                "price": 150.00,
                "vendor_id": 999
            },
            {
                "title": "Cherry Brandy (Bottle)",
                "description": "Famous local fruit brandy. Pickup only for 18+.",
                "price": 350.00,
                "vendor_id": 999
            },
            {
                "title": "Dalle Khursani Pickle",
                "description": "Spicy pickle made from the famous round chili of Sikkim.",
                "price": 250.00,
                "vendor_id": 999
            }
        ]

        for p_data in products:
            Product.objects.create(
                title=p_data["title"],
                description=p_data["description"],
                price_amount=p_data["price"],
                vendor_id=p_data["vendor_id"],
                active=True
            )
            
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(products)} products!'))
