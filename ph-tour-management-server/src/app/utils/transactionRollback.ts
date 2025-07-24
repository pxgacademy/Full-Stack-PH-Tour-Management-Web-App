import mongoose, { ClientSession } from "mongoose";

export const transactionRollback = async <T>(
  fn: (session: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/*
//* For use in Express Controller
export const withTransactionHandler =
  (fn: (req: Request, res: Response, next: NextFunction, session: ClientSession) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      await fn(req, res, next, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };
*/
