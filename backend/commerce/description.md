# Commerce Module

## Description
Facilitates the "Commerce from Kiosk" flow. Allows kiosks to initiate deals (QR code generation) and vendors to scan/redeem them. Handles product listings for the Mart.

## Routes
### Products
- `GET /api/v1/commerce/products/`: List available local products.

### Deal Flow
- `POST /api/v1/commerce/deals/initiate/`: Kiosk creates a pending deal and gets a QR string.
- `GET /api/v1/commerce/deals/{id}/status/`: Check if a deal has been paid/redeemed.
- `GET /api/v1/commerce/deals/{id}/vendor-token/`: (Protected) Retrieve vendor redemption token.
- `POST /api/v1/commerce/scan/`: Vendor scans a user's QR code to complete a transaction.
