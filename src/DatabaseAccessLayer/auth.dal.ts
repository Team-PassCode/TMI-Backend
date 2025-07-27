import { Service } from 'typedi';
import DbConnection from './dbConnection';
import { DBqueries } from '../Shared/dBQueries';
import { RowDataPacket } from 'mysql2';

export interface AuthD extends RowDataPacket {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Created_On: Date;
  Updated_On: Date;
  Is_Active: string;
  User_Id: string;
}

@Service()
export default class AuthDatabaseAccessLayer extends DbConnection {
  constructor() {
    super();
  }

  async CreateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const result = await this.InsertOrUpdateDB(
      [DBqueries.CreateUser],
      [[userId, firstName, lastName, email]]
    );
    return result;
  }

  async CheckEmailExists(email: string) {
    const result = await this.ReadDB<AuthD[]>(DBqueries.DoesEmailExist, [
      email,
    ]);
    return result;
  }

  async GetUserById(userId: string) {
    const result = await this.ReadDB<AuthD[]>(DBqueries.GetUserById, [userId]);
    return result;
  }

  async UpdateUser(
    userId: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const result = await this.InsertOrUpdateDB(
      [DBqueries.UpdateUser],
      [[firstName, lastName, email, userId]]
    );
    return result;
  }
}
