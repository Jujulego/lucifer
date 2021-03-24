import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize, strings, virtualFs, workspaces } from '@angular-devkit/core';
import { ConnectionOptionsReader, createConnection } from 'typeorm';
import * as path from 'path';
import * as tsnode from 'ts-node';

// Constants
const TSCONFIG_PATH = path.join(__dirname, '../../tsconfig.tools.json');

// Schema
interface Schema {
  name: string;
  project?: string;
  database?: string;
}

// Rules
function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },

    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },

    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

// Factory
export function dbMigration(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // Load workspace
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    // Search for project
    if (!options.project) {
      options.project = workspace.extensions.defaultProject as string;
    }

    const project = workspace.projects.get(options.project);

    if (!project) {
      throw new SchematicsException(`Project ${options.project} not found`);
    }

    // Read typeorm config
    const reader = new ConnectionOptionsReader({ root: path.resolve(project.root) });
    const config = await reader.get(options.database || 'default');
    Object.assign(config, {
      entities: config.entities?.map(ent => typeof ent === 'string' ? path.join(path.resolve(project.root), ent) : ent)
    });

    // Setup tsnode
    tsnode.register({
      project: TSCONFIG_PATH,
      transpileOnly: true
    });

    // Generate sql
    const connection = await createConnection(config);
    const sql = await connection.driver.createSchemaBuilder().log();

    if (sql.upQueries.length === 0) {
      context.logger.info('No missing migration');
      return;
    }

    // Parse existing migration files
    const migrationsDir = path.join(project.root, config.cli!.migrationsDir!);
    const migrations = tree.getDir(migrationsDir).subfiles
      .filter(file => file.endsWith('.migration.ts'))
      .map((file: string) => {
        // Parse name
        file = file.replace(/\.migration\.ts$/, '');

        const dash = file.indexOf('-');
        const number = file.substr(0, dash);
        const name = file.substr(dash + 1);

        return { number, name };
      });

    let number = (migrations.length + 1).toString();
    while (number.length < 4) number = '0' + number;

    // Generate migration
    const template = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        number,
        name: options.name,
        sql,
        migrations
      }),
      move(normalize(migrationsDir))
    ]);

    return chain([
      mergeWith(template, MergeStrategy.Overwrite)
    ]);
  }
}
