/*




| Field                    | Explanation                                     |
| ------------------------ | ----------------------------------------------- |
| `trackingId`             | Unique ID like `TRK-20250729-000001`            |
| `type`                   | পার্সেল টাইপ (optional enums)                    |
| `status`                 | Current parcel status                           |
| `statusLogs[]`           | Subdocument array — track parcel status history |
| `sender/receiver`        | MongoDB references to `User` model              |
| `pickupAddress`          | Where to collect parcel                         |
| `deliveryAddress`        | Where to deliver                                |
| `fee`                    | Delivery cost (can be calculated or flat)       |
| `isBlocked`              | Admin can block                                 |
| `isCancelled`            | Sender can cancel if not dispatched             |
| `deliveredAt`            | When parcel was delivered                       |
| `createdAt`, `updatedAt` | Optional Mongoose timestamps                    |


*/
