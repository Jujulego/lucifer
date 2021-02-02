import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveMachine1612281551666 implements MigrationInterface {
    name = 'RemoveMachine1612281551666'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "machine" DROP CONSTRAINT "FK_e9e3c65b75ccacbdf2a96361e2e"`);
      await queryRunner.query(`DROP TABLE "machine"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "machine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shortName" character varying(50) NOT NULL, "ownerId" character varying NOT NULL, CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id"))`);
      await queryRunner.query(`ALTER TABLE "machine" ADD CONSTRAINT "FK_e9e3c65b75ccacbdf2a96361e2e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
