import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApiKey1615243981576 implements MigrationInterface {
  name = 'ApiKey1615243981576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "api_key"
                             (
                               "id"        uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                               "adminId"   character varying      NOT NULL,
                               "projectId" character varying(100) NOT NULL,
                               "label"     character varying(100) NOT NULL DEFAULT '',
                               "key"       text                   NOT NULL,
                               CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fb080786c16de6ace7ed0b69f7" ON "api_key" ("key") `);
    await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_e3ae9363d6b7ff8c352e12556ff" FOREIGN KEY ("adminId", "projectId") REFERENCES "project" ("adminId", "id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_e3ae9363d6b7ff8c352e12556ff"`);
    await queryRunner.query(`DROP INDEX "IDX_fb080786c16de6ace7ed0b69f7"`);
    await queryRunner.query(`DROP TABLE "api_key"`);
  }
}
