import {MigrationInterface, QueryRunner} from "typeorm";

export class NoProjectAdminFK1615398069111 implements MigrationInterface {
  name = 'NoProjectAdminFK1615398069111'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_e3ae9363d6b7ff8c352e12556ff"`);
    await queryRunner.query(`ALTER TABLE "variable" DROP CONSTRAINT "FK_cb7c42195ffec07d29dfb3f3384"`);
    await queryRunner.query(`ALTER TABLE "api_key" DROP COLUMN "adminId"`);
    await queryRunner.query(`ALTER TABLE "variable" DROP CONSTRAINT "PK_0f4b727d2f7186acf29053048a3"`);
    await queryRunner.query(`ALTER TABLE "variable" ADD CONSTRAINT "PK_e28d48731fb03c3afee326d5c3e" PRIMARY KEY ("projectId", "id")`);
    await queryRunner.query(`ALTER TABLE "variable" DROP COLUMN "adminId"`);
    await queryRunner.query(`COMMENT ON COLUMN "project"."adminId" IS NULL`);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
    await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_1fe973015df75de685d97d41016" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "variable" ADD CONSTRAINT "FK_4fa96d581f4e7b74fffdfebf7fa" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "variable" DROP CONSTRAINT "FK_4fa96d581f4e7b74fffdfebf7fa"`);
    await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_1fe973015df75de685d97d41016"`);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
    await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id", "adminId")`);
    await queryRunner.query(`COMMENT ON COLUMN "project"."adminId" IS NULL`);
    await queryRunner.query(`ALTER TABLE "variable" ADD "adminId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "variable" DROP CONSTRAINT "PK_e28d48731fb03c3afee326d5c3e"`);
    await queryRunner.query(`ALTER TABLE "variable" ADD CONSTRAINT "PK_0f4b727d2f7186acf29053048a3" PRIMARY KEY ("adminId", "projectId", "id")`);
    await queryRunner.query(`ALTER TABLE "api_key" ADD "adminId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "variable" ADD CONSTRAINT "FK_cb7c42195ffec07d29dfb3f3384" FOREIGN KEY ("adminId", "projectId") REFERENCES "project"("adminId","id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_e3ae9363d6b7ff8c352e12556ff" FOREIGN KEY ("adminId", "projectId") REFERENCES "project"("adminId","id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }
}
