//

import { Booking } from "../booking/booking.model";
import { Tour } from "../tour/tour.model";
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
    roleBased,
  ] = await Promise.all([
    User.estimatedDocumentCount(),
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
    userCountByRole: roleBased.map(({ _id, count }) => ({ role: _id, count })),
  };
};

//
export const getTourStatsService = async () => {
  const [totalTours, avgTourCost, highestBooked, typeBased, divisionBased] =
    await Promise.all([
      Tour.estimatedDocumentCount(),
      Tour.aggregate([{ $group: { _id: null, cost: { $avg: "$costFrom" } } }]),

      Booking.aggregate([
        {
          $group: { _id: "$tour", count: { $sum: 1 } },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "tours",
            let: { tourId: "$_id" },
            pipeline: [
              {
                $match: { $expr: { $eq: ["$_id", "$$tourId"] } },
              },
            ],
            as: "tour",
          },
        },
        {
          $unwind: "$tour",
        },
        {
          $project: {
            count: 1,
            "tour.title": 1,
            "tour.slug": 1,
          },
        },
      ]),

      Tour.aggregate([
        {
          $lookup: {
            from: "tourtypes",
            localField: "tourType",
            foreignField: "_id",
            as: "type",
          },
        },
        {
          $unwind: "$type",
        },
        {
          $group: { _id: "$type.name", count: { $sum: 1 } },
        },
      ]),

      Tour.aggregate([
        {
          $lookup: {
            from: "divisions",
            localField: "division",
            foreignField: "_id",
            as: "division",
          },
        },
        {
          $unwind: "$division",
        },
        {
          $group: { _id: "$division.name", count: { $sum: 1 } },
        },
      ]),

      //
    ]);

  return {
    totalTours,
    avgTourCost: avgTourCost?.[0]?.cost,
    highestBookedTour: highestBooked.map(({ _id, count, tour }) => ({
      tourId: _id,
      count,
      tour,
    })),
    totalTourBasedOnType: typeBased.map(({ _id, count }) => ({
      name: _id,
      count,
    })),
    totalTourBasedOnDivision: divisionBased.map(({ _id, count }) => ({
      name: _id,
      count,
    })),
  };
};

//
export const getBookingStatsService = async () => {
  return {};
};

//
export const getPaymentStatsService = async () => {
  return {};
};
