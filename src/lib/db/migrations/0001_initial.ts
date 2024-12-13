import { sql } from 'kysely';
import type { NamedMigration } from '../migrations';

const migration: NamedMigration = {
  name: "0001_initial",
  up: async (db) => {
    await db.schema
      .createTable('reminders')
      .addColumn('id', 'integer', (col) =>
        col.primaryKey().autoIncrement()
      ) // Use 'integer' with autoIncrement for compatibility.
      .addColumn('title', 'varchar', (col) => col.notNull())
      .addColumn('message', 'varchar', (col) => col.notNull())
      .addColumn('desc', 'text', (col) => col.notNull())
      .addColumn('interval', 'varchar', (col) => col.notNull())
      .addColumn('active', 'boolean', (col) => col.defaultTo(false).notNull())
      .addColumn('type', 'varchar', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) =>
        col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
      ) // Use CURRENT_TIMESTAMP for compatibility.
      .execute();
  },
  down: async (db) => {
    await db.schema.dropTable('reminders').execute();
  },
};

export default migration;
