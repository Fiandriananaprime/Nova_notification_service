# Nova_notification_service
Notification microservice for NovaMarket, responsible for managing and delivering user notifications across the platform, including order updates, account events, system alerts, and other application notifications.

## Verification SMS

Set `SMS_WEBHOOK_URL` to an HTTP endpoint that accepts `{ "target": "...", "message": "..." }`.
The notification service fails the message when this transport is not configured or returns a non-2xx response.
