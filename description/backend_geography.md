# Geography App (`backend/apps/geography`)

The `geography` app is responsible for defining the structural and spatial hierarchy of the system (Zones, Districts, Clusters).

## Current State
- **Status**: Placeholder structures.
- **Seeding**: The `core.management.commands.seed_sikkim_demo` command currently manages district and cluster definitions virtually (string-based in models like `Hotspot`) as the full geospatial models are not yet implemented.
- **Future**: Will contain `District`, `Cluster`, and `TransportHub` models with PostGIS integration.
