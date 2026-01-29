from django.contrib import admin
from apps.core.admin_utils import register_all_models

# Register all geography models with sensible defaults
register_all_models('geography')
