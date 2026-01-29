import os
from django.core.wsgi import get_wsgi_application

import sys
from pathlib import Path

# Add apps folder to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent / 'apps'))
sys.path.append(str(Path(__file__).resolve().parent.parent.parent / 'services'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
