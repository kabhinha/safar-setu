import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from commerce.models import Product

def seed_products():
    products = [
        {"title": "Local Wild Honey", "price": 450.00, "vendor_id": 101, "desc": "Pure organic honey from tribal clusters."},
        {"title": "Bamboo Water Bottle", "price": 800.00, "vendor_id": 102, "desc": "Eco-friendly handmade bottle."},
        {"title": "Assamese Tea Sampler", "price": 300.00, "vendor_id": 101, "desc": "3 varieties of premium tea."},
        {"title": "Handwoven Scarf", "price": 1200.00, "vendor_id": 103, "desc": "Traditional motifs, cotton blend."},
        {"title": "Rice Beer Starter Kit", "price": 150.00, "vendor_id": 102, "desc": "Traditional fermentation cake."},
    ]

    print(f"Existing Products: {Product.objects.count()}")
    
    for p in products:
        obj, created = Product.objects.get_or_create(
            title=p["title"],
            defaults={
                "price_amount": p["price"],
                "vendor_id": p["vendor_id"],
                "description": p["desc"],
                "active": True
            }
        )
        if created:
            print(f"Created: {obj.title}")
        else:
            print(f"Exists: {obj.title}")

if __name__ == "__main__":
    seed_products()
