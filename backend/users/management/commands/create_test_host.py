from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a test host user'

    def handle(self, *args, **options):
        if not User.objects.filter(email='host@example.com').exists():
            user = User.objects.create_user(
                username='hostuser',
                email='host@example.com',
                password='password123',
                role=User.Role.HOST,
                is_active=True,
                kyc_status=User.KYCStatus.VERIFIED
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created host: {user.email} / password123'))
        else:
            self.stdout.write(self.style.WARNING('Host user already exists'))
