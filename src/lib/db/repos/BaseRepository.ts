import type { UpdateResult, Insertable, InsertObject } from "kysely";
import { db } from "../db";
import {
  type DbOperation,
  successfulOperation,
  failedOperation,
} from "../utils/DbOperation";
import type { Database } from "../schema";

interface IRepository<TEntity, TNewEntity> {
  getById({ id }: { id: number }): Promise<DbOperation<TEntity>>;
  getAll(): Promise<DbOperation<TEntity[]>>;
  findRecords(criteria: Partial<TEntity>): Promise<DbOperation<TEntity[]>>;
  create({ data }: { data: TNewEntity }): Promise<DbOperation<TEntity>>;
  update({
    id,
    data,
  }: {
    id: number;
    data: Partial<TEntity>;
  }): Promise<DbOperation<UpdateResult[]>>;
  delete({ id }: { id: number }): Promise<DbOperation<number>>;
  deleteRange({ ids }: { ids: number[] }): Promise<DbOperation<number[]>>;
}

export abstract class BaseRepository<TEntity, TNewEntity>
  implements IRepository<TEntity, TNewEntity> {
  table: keyof Database;

  constructor(tableName: keyof Database) {
    this.table = tableName;
  }

  async findRecords(
    criteria: Partial<TEntity>
  ): Promise<DbOperation<TEntity[]>> {
    try {
      let query = db.selectFrom(this.table);
      // Loop over each key in the criteria object
      for (const [column, value] of Object.entries(criteria)) {
        if (value === null) {
          query = query.where(column as any, "is", null);
        } else if (value !== undefined) {
          query = query.where(column as any, "=", value);
        }
      }
      // Cast the result to unknown first, then to the expected type
      const data = (await query.selectAll().execute()) as TEntity[];
      return successfulOperation({ data });
    } catch (error) {
      return failedOperation({ error });
    }
  }

  async getById({ id }: { id: number }): Promise<DbOperation<TEntity>> {
    try {
      const data = (await db
        .selectFrom(this.table)
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst()) as TEntity;

      if (data) return successfulOperation<TEntity>({ data });
      else
        return failedOperation({
          message: `Could not find record with id '${id}' in table '${this.table}'`,
        });
    } catch (error) {
      return failedOperation({ error });
    }
  }

  async getAll(): Promise<DbOperation<TEntity[]>> {
    try {
      const data = (await db
        .selectFrom(this.table)
        .selectAll()
        .execute()) as TEntity[];

      return successfulOperation({ data });
    } catch (error) {
      return failedOperation({ error });
    }
  }

  async create({ data }: { data: TNewEntity }): Promise<DbOperation<TEntity>> {
    try {
      const result = (await db
        .insertInto(this.table)
        .values(data as InsertObject<Database, typeof this.table>[])
        .returningAll()
        .executeTakeFirstOrThrow()) as TEntity;

      return successfulOperation({ data: result });
    } catch (error) {
      console.log(error)
      return failedOperation({ error });
    }
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<TEntity>;
  }): Promise<DbOperation<UpdateResult[]>> {
    try {
      const result = await db
        .updateTable(this.table)
        .set(data)
        .where("id", "=", id)
        .execute();
      return successfulOperation({ data: result });
    } catch (error) {
      return failedOperation({ error });
    }
  }

  async delete({ id }: { id: number }): Promise<DbOperation<number>> {
    try {
      const result = (await db
        .deleteFrom(this.table)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst()) as TEntity;

      if (result) {
        return successfulOperation({ data: id });
      } else {
        return failedOperation({
          message: `Could not delete record with id '${id}' from table '${this.table}'`,
        });
      }
    } catch (error) {
      return failedOperation({ error });
    }
  }

  async deleteRange({
    ids,
  }: {
    ids: number[];
  }): Promise<DbOperation<number[]>> {
    try {
      const result = (await db
        .deleteFrom(this.table)
        .where("id", "in", ids) // use 'in' for the range of IDs
        .returningAll()
        .execute()) as TEntity[];

      if (result.length > 0) {
        // checking if any records were deleted
        return successfulOperation({ data: ids });
      } else {
        return failedOperation({
          message: `Could not delete records with ids '${ids.join(
            ", "
          )}' from table '${this.table}'`,
        });
      }
    } catch (error) {
      return failedOperation({ error });
    }
  }
}
