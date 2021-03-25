// import { IUserModel } from '~/models/user.model';

// declare namespace Express {
//   export interface Request {
//     user?: any;
//     currentUser?: any;
//   }
// }
declare global {
  namespace Express {
    interface Request {
      user?: any;
      currentUser?: any;
    }
  }
}
