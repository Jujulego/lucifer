import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule, SchematicContext,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize, strings, virtualFs, workspaces } from '@angular-devkit/core';
import { ConnectionOptionsReader, createConnection } from 'typeorm';
import * as path from 'path';

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

    // Generate sql
    const connection = await createConnection(config);
    const sql = await connection.driver.createSchemaBuilder().log();

    if (sql.upQueries.length === 0) {
      context.logger.info('No missing migration');
      return;
    }

    const template = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name,
        filename: options.name,
      }),
      move(normalize(path.join(project.root, config.cli!.migrationsDir!)))
    ]);

    return chain([
      mergeWith(template)
    ]);
  }
}
