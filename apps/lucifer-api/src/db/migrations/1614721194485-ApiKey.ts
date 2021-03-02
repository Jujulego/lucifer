import {MigrationInterface, QueryRunner} from "typeorm";

export class ApiKey1614721194485 implements MigrationInterface {
    name = 'ApiKey1614721194485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_key" ("userId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(100) NOT NULL DEFAULT '', "key" text NOT NULL, CONSTRAINT "PK_a7eac1ffaa33af7b2a712c097ee" PRIMARY KEY ("userId", "id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fb080786c16de6ace7ed0b69f7" ON "api_key" ("key") `);
        await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_277972f4944205eb29127f9bb6c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_277972f4944205eb29127f9bb6c"`);
        await queryRunner.query(`DROP INDEX "IDX_fb080786c16de6ace7ed0b69f7"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
    }

}
