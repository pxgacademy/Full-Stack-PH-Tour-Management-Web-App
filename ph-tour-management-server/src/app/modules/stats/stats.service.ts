//

import { eIsActive } from "../user/user.interface";
import { User } from "../user/user.model";

/*
//* Professional and Production level code
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

* setDate() returns timestamp (number)
* In the MongoDB query it is becoming a timestamp number instead of a Date
* It can give unexpected behavior

*/

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

//

export const getUserStatsService = async () => {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUserInLastSevenDays,
    newUserInLastThirtyDays,
    userCountByRole,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: eIsActive.ACTIVE }),
    User.countDocuments({ isActive: eIsActive.INACTIVE }),
    User.countDocuments({ isActive: eIsActive.BLOCKED }),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUserInLastSevenDays,
    newUserInLastThirtyDays,
    userCountByRole: userCountByRole.map(({ _id, count }) => ({
      role: _id,
      count,
    })),
  };
};

//
export const getTourStatsService = async () => {
  return {};
};

//
export const getBookingStatsService = async () => {
  return {};
};

//
export const getPaymentStatsService = async () => {
  return {};
};
