import path from 'path';
import ts from 'typescript';

/**
 * /!\ leave the empty package.json in this subfolder in order
 * to avoid ERR_REQUIRE_ESM when using a .ts transformer with
 * ttypescript (under the hood, ts-node will try to infer the module
 * type from the nearest package.json - next-markdown is marked as
 * "type": "module") /!\
 */

/**
 * Predicate to match TS module specifiers :
 * - match import or export declerations
 * - module specifier should look like a relative path
 * @todo: support relative directory imports
 */

const shouldMutateModuleSpecifier = (
  node: ts.Node,
): node is (ts.ImportDeclaration | ts.ExportDeclaration) & {
  moduleSpecifier: ts.StringLiteral;
} =>
  (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
  node.moduleSpecifier !== undefined &&
  ts.isStringLiteral(node.moduleSpecifier) &&
  (node.moduleSpecifier.text.startsWith('./') || node.moduleSpecifier.text.startsWith('../')) &&
  path.extname(node.moduleSpecifier.text) === '';

/**
 * Append .js extensions TS transformer
 * - to import declarations
 * - to export declarations
 */
export default function (_: ts.Program, __: {}) {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      function visitor(node: ts.Node): ts.Node {
        if (shouldMutateModuleSpecifier(node)) {
          if (ts.isImportDeclaration(node)) {
            return ts.factory.updateImportDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.importClause,
              ts.factory.createStringLiteral(`${node.moduleSpecifier.text}.js`),
              undefined,
            );
          } else if (ts.isExportDeclaration(node)) {
            return ts.factory.updateExportDeclaration(
              node,
              node.decorators,
              node.modifiers,
              false,
              node.exportClause,
              ts.factory.createStringLiteral(`${node.moduleSpecifier.text}.js`),
              undefined,
            );
          }
        }

        return ts.visitEachChild(node, visitor, ctx);
      }
      return ts.visitEachChild(sourceFile, visitor, ctx);
    };
  };
}
