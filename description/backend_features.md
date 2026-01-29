# Features App (`backend/apps/features`)

The `features` app manages dynamic feature flags to toggle system functionality without code deployment.

## Models

### `FeatureFlag`
- **Fields**: `name` (unique key), `is_global_enabled` (boolean), `rollout_percentage` (0-100), `description`.
- **Purpose**: Controls visibility of features like `RECO_ENGINE`, `KIOSK_MODE`, etc.

## Usage
- Flags are checked via a utility service or context processor in templates.
