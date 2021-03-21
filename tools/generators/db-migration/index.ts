import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { virtualFs, workspaces } from '@angular-devkit/core';
import { ConnectionOptionsReader, createConnection } from 'typeorm';

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
  return async (tree: Tree) => {
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
    const reader = new ConnectionOptionsReader({ root: project.sourceRoot });
    const config = await reader.get(options.database || 'default');

    // Generate sql
    const connection = await createConnection(config);
    const sql = await connection.driver.createSchemaBuilder().log();
  }
}
