from django.apps import apps
from django.contrib import admin


def _default_list_display(model):
    field_names = [f.name for f in model._meta.fields if not f.many_to_many and not f.one_to_many]
    return field_names[:4] if field_names else ('__str__',)


def _default_search_fields(model):
    candidates = []
    for f in model._meta.fields:
        if f.name in ('name', 'title', 'email', 'phone', 'code', 'username'):
            candidates.append(f.name)
        elif f.db_index or f.unique:
            candidates.append(f.name)
    return candidates[:4]


def register_all_models(app_label, *, exclude=None, readonly_models=None):
    """
    Safe helper: auto-register any models in an app that are not yet registered.
    Intended to give visibility in admin without custom per-model classes.
    """
    exclude = set(exclude or [])
    readonly_models = set(readonly_models or [])

    app_config = apps.get_app_config(app_label)
    for model in app_config.get_models():
        name = model.__name__
        if name in exclude or admin.site.is_registered(model):
            continue

        readonly = name in readonly_models
        readonly_field_names = []
        for f in model._meta.fields:
            if getattr(f, 'auto_now', False) or getattr(f, 'auto_now_add', False) or f.primary_key:
                readonly_field_names.append(f.name)

        attrs = {
            'list_display': _default_list_display(model),
            'search_fields': _default_search_fields(model),
            'list_filter': [f.name for f in model._meta.fields if f.choices][:3],
            'ordering': ('-' + model._meta.pk.name,) if model._meta.pk else None,
            'readonly_fields': readonly_field_names if readonly else (),
        }

        class AutoAdmin(admin.ModelAdmin):
            list_display = attrs['list_display']
            search_fields = attrs['search_fields']
            list_filter = attrs['list_filter']
            if attrs['ordering']:
                ordering = attrs['ordering']
            if attrs['readonly_fields']:
                readonly_fields = attrs['readonly_fields']

            def has_add_permission(self, request):
                return not readonly

            def has_change_permission(self, request, obj=None):
                return not readonly

            def has_delete_permission(self, request, obj=None):
                return not readonly

        admin.site.register(model, AutoAdmin)
