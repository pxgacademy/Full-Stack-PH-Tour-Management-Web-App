/*
export interface CustomJwtPayload extends JwtPayload {
  _id: string | Types.ObjectId;
  email: string;
  role: string;
}

// it also works
declare global {
  namespace jsonwebtoken {
    interface JwtPayload {
      _id?: string | Types.ObjectId;
      email?: string;
      role?: string;
    }
  }
}

    */
