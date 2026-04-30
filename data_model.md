# Data Model

## Event Flow

## Base Event Schema

All events share the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | string (uuid) | Unique identifier for each event |
| `event_type` | string | Type of user action (`visit`, `search`, `booking`) |
| `user_id` | string | Identifies the user performing the action |
| `timestamp` | datetime | When the event occurred |
| `source` | string | Marketing or referral source (e.g. Sarah, John, Ali) |
| `origin` | string *(optional)* | Starting location of the ride |
| `destination` | string *(optional)* | Destination location of the ride |
| `metadata` | json *(optional)* | Additional data if needed |

---

## Event Types

### `website_visit`
Triggered when a user lands on the website.

| Field | Required |
|---|---|
| `event_type` | Yes |
| `user_id` | Yes |
| `timestamp` | Yes |
| `source` | Yes |

---

### `ride_search`
Triggered when a user searches for a ride.

| Field | Required |
|---|---|
| `event_type` | Yes |
| `user_id` | Yes |
| `timestamp` | Yes |
| `origin` | Yes |
| `destination` | Yes |

---

### `booking_completed`
Triggered when a user completes a booking.

| Field | Required |
|---|---|
| `event_type` | Yes |
| `user_id` | Yes |
| `timestamp` | Yes |
| `origin` | Yes |
| `destination` | Yes |