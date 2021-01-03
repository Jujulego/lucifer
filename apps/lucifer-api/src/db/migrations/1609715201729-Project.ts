import {MigrationInterface, QueryRunner} from "typeorm";

export class Project1609715201729 implements MigrationInterface {
    name = 'Project1609715201729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "adminId" character varying NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9e5c56e72fbbb0a00cd5d9c3d3b" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9e5c56e72fbbb0a00cd5d9c3d3b"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
