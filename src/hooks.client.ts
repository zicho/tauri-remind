import { browser } from '$app/environment';
import { db } from '$lib/db/db';
import { CustomMigrationProvider } from '@/db/migrator';
import { Migrator } from 'kysely';

const migrator = new Migrator({
  db,
  provider: new CustomMigrationProvider(),
});

const { error, results } = await migrator.migrateToLatest();

if (error) {
  console.error('Migration failed:', error);
  // Handle the error as needed
} else {
  console.log('Migrations applied successfully:', results);
}
