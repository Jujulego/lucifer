import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectMember0006Migration implements MigrationInterface {
  name = 'ProjectMember1615399818916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "project_member"
                             (
                               "projectId" character varying(100) NOT NULL,
                               "userId"    character varying      NOT NULL,
                               "admin"     boolean                NOT NULL DEFAULT false,
                               CONSTRAINT "PK_1f95533c37d5a7215c796d6ac9f" PRIMARY KEY ("projectId", "userId")
                             )`);
    await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`INSERT INTO "project_member"
                             SELECT "id" as "projectId", "adminId" as "userId", true as "admin"
                             FROM "project"`);

    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9e5c56e72fbbb0a00cd5d9c3d3b"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "adminId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "adminId" character varying`);
    await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9e5c56e72fbbb0a00cd5d9c3d3b" FOREIGN KEY ("adminId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`UPDATE "project"
                             SET "project"."adminId" = "project_member"."userId"
                             FROM "project"
                                    INNER JOIN "project_member" on "project"."id" = "project_member"."projectId"
                             WHERE "project_member"."admin"`);

    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "adminId" character varying NOT NULL`)

    await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_e7520163dafa7c1104fd672caad"`);
    await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4"`);
    await queryRunner.query(`DROP TABLE "project_member"`);
  }

}
