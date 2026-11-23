const TypeDoc = require('typedoc');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const ts = require('typescript');

const getBlockTagText = (item, tagName) =>
  item.comment?.blockTags
    ?.find(tag => tag.tag === tagName)
    ?.content.reduce((result, str) => result.concat(str.text), '')
    ?.trim() || '';

const getTokenList = (list, source) =>
  list
    .filter(
      item =>
        !item.comment?.blockTags.some(tag => tag.tag === '@internal' || tag.tag === '@private'),
    )
    .map(item => {
      const since = getBlockTagText(item, '@since');
      return {
        source,
        token: item.name,
        type: item.type.toString(),
        desc: getBlockTagText(item, '@desc'),
        descEn: getBlockTagText(item, '@descEN'),
        name: getBlockTagText(item, '@nameZH'),
        nameEn: getBlockTagText(item, '@nameEN'),
        ...(since ? { since } : {}),
      };
    });

const resolveTsModuleFile = (fromFile, specifier) => {
  if (!specifier || !specifier.startsWith('.')) {
    return null;
  }
  const basePath = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];
  return (
    candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ||
    null
  );
};

const getJsDocTagText = tag => {
  if (!tag || !tag.comment) {
    return '';
  }
  if (typeof tag.comment === 'string') {
    return tag.comment.trim();
  }
  if (typeof ts.getTextOfJSDocComment === 'function') {
    return (ts.getTextOfJSDocComment(tag.comment) || '').trim();
  }
  return Array.isArray(tag.comment)
    ? tag.comment
        .map(part => (typeof part === 'string' ? part : part.text || ''))
        .join('')
        .trim()
    : '';
};

const extractMemberName = (nameNode, sourceFile) => {
  if (!nameNode) {
    return '';
  }
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text;
  }
  return nameNode.getText(sourceFile).replace(/^['"]|['"]$/g, '');
};

const parseSourceFileCached = (() => {
  const cache = new Map();
  return filePath => {
    const normalized = path.resolve(filePath);
    if (cache.has(normalized)) {
      return cache.get(normalized);
    }
    const content = fs.readFileSync(normalized, 'utf8');
    const scriptKind = normalized.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(
      normalized,
      content,
      ts.ScriptTarget.Latest,
      true,
      scriptKind,
    );
    cache.set(normalized, sourceFile);
    return sourceFile;
  };
})();

const extractTokensFromType = (filePath, symbolName, visited = new Set()) => {
  const resolved = path.resolve(filePath);
  const visitKey = `${resolved}::${symbolName}`;
  if (visited.has(visitKey) || !fs.existsSync(resolved)) {
    return {};
  }
  visited.add(visitKey);

  const sourceFile = parseSourceFileCached(resolved);
  const localDecls = new Map();
  const importedSymbols = new Map();
  const reExports = [];

  ts.forEachChild(sourceFile, node => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      localDecls.set(node.name.text, node);
    } else if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const targetFile = resolveTsModuleFile(resolved, node.moduleSpecifier.text);
      const namedBindings = node.importClause?.namedBindings;
      if (targetFile && namedBindings && ts.isNamedImports(namedBindings)) {
        namedBindings.elements.forEach(el => {
          const localName = el.name.text;
          const importedName = el.propertyName ? el.propertyName.text : localName;
          importedSymbols.set(localName, { file: targetFile, symbol: importedName });
        });
      }
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const targetFile = resolveTsModuleFile(resolved, node.moduleSpecifier.text);
      if (targetFile) {
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          node.exportClause.elements.forEach(el => {
            const exportedName = el.name.text;
            const originalName = el.propertyName ? el.propertyName.text : exportedName;
            if (exportedName === symbolName) {
              reExports.push({ file: targetFile, symbol: originalName });
            }
          });
        } else {
          reExports.push({ file: targetFile, symbol: symbolName });
        }
      }
    }
  });

  const collectMembers = members => {
    const result = {};
    members.forEach(member => {
      if (!ts.isPropertySignature(member)) {
        return;
      }
      const propName = extractMemberName(member.name, sourceFile);
      if (!propName || propName.startsWith('_')) {
        return;
      }
      const tags = ts.getJSDocTags(member);
      if (tags.some(tag => tag.tagName.text === 'internal' || tag.tagName.text === 'private')) {
        return;
      }

      let desc = '';
      let descEn = '';
      let name = '';
      let nameEn = '';
      let since = '';

      tags.forEach(tag => {
        const tagName = tag.tagName.text;
        const text = getJsDocTagText(tag);
        if (tagName === 'desc') {
          desc = text;
        } else if (tagName === 'descEN' || tagName === 'descEn') {
          descEn = text;
        } else if (tagName === 'nameZH') {
          name = text;
        } else if (tagName === 'nameEN') {
          nameEn = text;
        } else if (tagName === 'since') {
          since = text;
        }
      });

      const typeStr = member.type
        ? member.type.getText(sourceFile).replace(/\s+/g, ' ').trim()
        : 'any';

      result[propName] = {
        desc,
        descEn,
        type: typeStr,
        ...(name ? { name } : {}),
        ...(nameEn ? { nameEn } : {}),
        ...(since ? { since } : {}),
      };
    });
    return result;
  };

  const resolveTypeNode = typeNode => {
    if (!typeNode) {
      return {};
    }
    if (ts.isTypeLiteralNode(typeNode)) {
      return collectMembers(typeNode.members);
    }
    if (ts.isIntersectionTypeNode(typeNode)) {
      return typeNode.types.reduce((acc, sub) => Object.assign(acc, resolveTypeNode(sub)), {});
    }
    if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
      const refName = typeNode.typeName.text;
      if (localDecls.has(refName)) {
        return extractTokensFromType(resolved, refName, visited);
      }
      if (importedSymbols.has(refName)) {
        const imp = importedSymbols.get(refName);
        return extractTokensFromType(imp.file, imp.symbol, visited);
      }
    }
    return {};
  };

  const decl = localDecls.get(symbolName);
  if (decl) {
    const tokens = {};
    if (ts.isInterfaceDeclaration(decl)) {
      if (decl.heritageClauses) {
        decl.heritageClauses.forEach(clause => {
          clause.types.forEach(exprWithTypeArgs => {
            if (ts.isIdentifier(exprWithTypeArgs.expression)) {
              const parentName = exprWithTypeArgs.expression.text;
              if (localDecls.has(parentName)) {
                Object.assign(tokens, extractTokensFromType(resolved, parentName, visited));
              } else if (importedSymbols.has(parentName)) {
                const imp = importedSymbols.get(parentName);
                Object.assign(tokens, extractTokensFromType(imp.file, imp.symbol, visited));
              }
            }
          });
        });
      }
      Object.assign(tokens, collectMembers(decl.members));
      return tokens;
    }
    if (ts.isTypeAliasDeclaration(decl)) {
      return resolveTypeNode(decl.type);
    }
  }

  for (const reExport of reExports) {
    const tokens = extractTokensFromType(reExport.file, reExport.symbol, visited);
    if (Object.keys(tokens).length > 0) {
      return tokens;
    }
  }

  if (importedSymbols.has(symbolName)) {
    const imp = importedSymbols.get(symbolName);
    return extractTokensFromType(imp.file, imp.symbol, visited);
  }

  return {};
};

const collectComponentTokenMeta = () => {
  const componentsFile = path.resolve(process.cwd(), 'components/theme/interface/components.ts');
  const componentsMeta = {};
  const mappedFiles = new Set();

  if (fs.existsSync(componentsFile)) {
    const sourceFile = parseSourceFileCached(componentsFile);
    const importMap = new Map();

    ts.forEachChild(sourceFile, node => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const targetFile = resolveTsModuleFile(componentsFile, node.moduleSpecifier.text);
        const namedBindings = node.importClause?.namedBindings;
        if (targetFile && namedBindings && ts.isNamedImports(namedBindings)) {
          namedBindings.elements.forEach(el => {
            const localName = el.name.text;
            const importedName = el.propertyName ? el.propertyName.text : localName;
            importMap.set(localName, { file: targetFile, symbol: importedName });
          });
        }
      }
    });

    ts.forEachChild(sourceFile, node => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === 'ComponentTokenMap') {
        node.members.forEach(member => {
          if (!ts.isPropertySignature(member)) {
            return;
          }
          const compName = extractMemberName(member.name, sourceFile);
          if (!compName || compName === 'Wave') {
            return;
          }
          if (
            member.type &&
            ts.isTypeReferenceNode(member.type) &&
            ts.isIdentifier(member.type.typeName)
          ) {
            const typeAlias = member.type.typeName.text;
            const target = importMap.get(typeAlias);
            if (target) {
              mappedFiles.add(path.resolve(target.file));
              const tokens = extractTokensFromType(target.file, target.symbol);
              if (Object.keys(tokens).length > 0) {
                componentsMeta[compName] = tokens;
              }
            }
          }
        });
      }
    });
  }

  // Fallback scan across components/*/style/*.ts(x) for any ComponentToken not mapped in components.ts
  const styleFiles = glob.sync(
    path.join(process.cwd(), 'components/*/style/*.?(ts|tsx)').replace(/\\/g, '/'),
  );
  styleFiles.forEach(file => {
    const resolved = path.resolve(file);
    if (mappedFiles.has(resolved)) {
      return;
    }
    const content = fs.readFileSync(resolved, 'utf8');
    if (!/\bComponentToken\b/.test(content)) {
      return;
    }
    const hookMatch = content.match(/genComponentStyleHook(?:<[^>]+>)?\(\s*['"]([A-Za-z0-9]+)['"]/);
    if (!hookMatch) {
      return;
    }
    const compName = hookMatch[1];
    if (componentsMeta[compName]) {
      return;
    }
    const tokens = extractTokensFromType(resolved, 'ComponentToken');
    if (Object.keys(tokens).length > 0) {
      componentsMeta[compName] = tokens;
    }
  });

  return componentsMeta;
};

function main() {
  const outArgIndex = process.argv.indexOf('--out');
  const output =
    (outArgIndex > -1 && process.argv[outArgIndex + 1]) ||
    process.env.TOKEN_META_OUTPUT ||
    'components/version/token-meta.json';

  const app = new TypeDoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    // typedoc options here
    entryPoints: ['components/theme/interface/index.ts'],
    skipErrorChecking: true,
  });

  const project = app.convert();

  if (project) {
    // Project may not have converted correctly
    const tokenMeta = {};
    let presetColors = [];
    project.children.forEach(type => {
      if (type.name === 'SeedToken') {
        tokenMeta.seed = getTokenList(type.children, 'seed');
      } else if (type.name === 'MapToken') {
        tokenMeta.map = getTokenList(type.children, 'map');
      } else if (type.name === 'AliasToken') {
        tokenMeta.alias = getTokenList(type.children, 'alias');
      } else if (type.name === 'PresetColors') {
        presetColors = type.type.target.elements.map(item => item.value);
      }
    });

    // Exclude preset colors
    tokenMeta.seed = tokenMeta.seed.filter(
      item => !presetColors.some(color => item.token.startsWith(color)),
    );
    tokenMeta.map = tokenMeta.map.filter(
      item => !presetColors.some(color => item.token.startsWith(color)),
    );
    tokenMeta.alias = tokenMeta.alias.filter(
      item => !presetColors.some(color => item.token.startsWith(color)),
    );

    tokenMeta.alias = tokenMeta.alias.filter(
      item => !tokenMeta.map.some(mapItem => mapItem.token === item.token),
    );
    tokenMeta.map = tokenMeta.map.filter(
      item => !tokenMeta.seed.some(seedItem => seedItem.token === item.token),
    );

    const globalMeta = Object.entries(tokenMeta).reduce((acc, [key, value]) => {
      value.forEach(item => {
        acc[item.token] = {
          name: item.name,
          nameEn: item.nameEn,
          desc: item.desc,
          descEn: item.descEn,
          type: item.type,
          source: key,
          ...(item.since ? { since: item.since } : {}),
        };
      });
      return acc;
    }, {});

    const componentsMeta = collectComponentTokenMeta();

    // Preserve top-level flat global entries for backwards compatibility with existing consumers
    // while also exposing structured `global` and `components` maps.
    const finalMeta = {
      ...globalMeta,
      global: globalMeta,
      components: componentsMeta,
    };

    fs.ensureDirSync(path.dirname(output));
    fs.writeJsonSync(output, finalMeta, 'utf8');
    // eslint-disable-next-line no-console
    console.log(
      `✅  Token Meta has been written to ${output} (${Object.keys(globalMeta).length} global, ${
        Object.keys(componentsMeta).length
      } components)`,
    );
  }
}

main();
