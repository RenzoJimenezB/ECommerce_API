import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersPasswordLength1730134173197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(25)`,
    );
  }
}
