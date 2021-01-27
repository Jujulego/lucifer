import {MigrationInterface, QueryRunner} from "typeorm";

export class Variable1611440573939 implements MigrationInterface {
    name = 'Variable1611440573939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "variable" ("adminId" character varying NOT NULL, "projectId" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "value" text, CONSTRAINT "PK_0f4b727d2f7186acf29053048a3" PRIMARY KEY ("adminId", "projectId", "name"))`);
        await queryRunner.query(`ALTER TABLE "variable" ADD CONSTRAINT "FK_cb7c42195ffec07d29dfb3f3384" FOREIGN KEY ("adminId", "projectId") REFERENCES "project"("adminId","id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variable" DROP CONSTRAINT "FK_cb7c42195ffec07d29dfb3f3384"`);
        await queryRunner.query(`DROP TABLE "variable"`);
    }

}