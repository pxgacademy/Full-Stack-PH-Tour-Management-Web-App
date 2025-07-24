import mongoose, { ClientSession } from "mongoose";

type TransactionalFunction<T> = (session: ClientSession) => Promise<T>;

export const transactionRollback = async <T>(
  fn: TransactionalFunction<T>
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
type tFN<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: ClientSession
) => Promise<T>;

export const withTransactionHandler =
  <T>(fn: tFN<T>) =>
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
