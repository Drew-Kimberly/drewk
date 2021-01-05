#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import * as rimraf from 'rimraf';
import * as svgo from 'svgo';
import * as camelcase from 'camelcase';
import { debug as debugModule } from 'debug';

const SVG: new (config: svgo.Options) => svgo = require('svgo');
const camelCase: (
  input: string,
  option?: camelcase.Options
) => string = require('camelcase');

const DEBUG = false; // Alternatively set DEBUG env variable.
const generatedDirectoryName = 'generated';
const debugScope = '@drewk/react-ui-icons:generate';
const debug = debugModule(debugScope);

if (DEBUG) {
  debugModule.enable(debugScope);
}

program
  .option(
    '--create-icon-source <directory>',
    'Location of the createIcon function.'
  )
  .option(
    '--glob-patterns <patterns>',
    'Comma-delimited list of glob patterns for icon directories',
    (val) => val.split(',')
  )
  .parse(process.argv);

const iconDirectories: string[] = program.globPatterns.reduce(
  (dirs, pattern) => {
    return dirs.concat(
      glob.sync(pattern, { nocase: true, ignore: ['**/node_modules/**'] })
    );
  },
  []
);

debug('Found the following icon directories:', iconDirectories);

iconDirectories.forEach((directory) => {
  const fullDirectoryPath = path.join(process.cwd(), directory);
  const files = glob.sync('*.svg', { cwd: fullDirectoryPath });
  debug(
    `Found the following SVG icon files in directory ${fullDirectoryPath}:`,
    files
  );
  if (files.length === 0) {
    return;
  }

  const generatedDir = createGeneratedDirectory(fullDirectoryPath);
  debug(`Created new directory for storing icon components at ${generatedDir}`);

  const headerStatements: string[] = [
    '/* eslint-disable */',
    '/* This file was auto-generated using @drewk/react-ui-icons:generate, and should be checked in. Warning - Manual changes will be lost! */',
    `import React from 'react';`,
    `import { createIcon } from '${program.createIconSource}';`,
  ];

  const exportStatementPromises = files.map((filename) => {
    const file = fs
      .readFileSync(path.join(fullDirectoryPath, filename))
      .toString();
    const fileNoExtension = path.basename(filename, '.svg').toLowerCase();
    const svg = new SVG({
      plugins: [
        { cleanupIDs: { prefix: `${fileNoExtension}-` } },
        { convertShapeToPath: false },
        { removeAttrs: { attrs: 'xmlns.*' } },
        { removeDesc: true },
        { removeDoctype: true },
        { removeTitle: false },
        { removeViewBox: false },
      ],
    });

    return svg.optimize(file).then(({ data }) => {
      const displayName = `${camelCase(fileNoExtension, {
        pascalCase: true,
      })}Icon`;
      const transformedSVG = transformReactCompat(data);
      debug(`Transformed SVG content for icon ${displayName}:`, transformedSVG);

      const iconExport = `export const ${displayName} = createIcon(${JSON.stringify(
        displayName
      )}, (title) => ${transformedSVG});`;

      const svgIconPath = path.join(generatedDir, `${displayName}.tsx`);
      const svgIconContent = [...headerStatements, iconExport].join('\n');
      fs.writeFileSync(svgIconPath, svgIconContent);
      return `export { ${displayName} } from './${generatedDirectoryName}/${displayName}';`;
    });
  });

  const svgIndexPath = path.join(fullDirectoryPath, 'index.tsx');

  Promise.all(exportStatementPromises).then((exportStatements) => {
    const svgIndexContent = exportStatements.join('\n');
    fs.writeFileSync(svgIndexPath, svgIndexContent);
    debug(`Created ${path.join(directory, 'index.tsx')}`);
  });
});

function createGeneratedDirectory(fullPath: string) {
  const generatedDir = path.join(fullPath, generatedDirectoryName);
  rimraf.sync(generatedDir);
  fs.mkdirSync(generatedDir);
  return generatedDir;
}

function transformReactCompat(svgContent: string) {
  const transform = (...transformers: ((svgContent: string) => string)[]) =>
    transformers.reduce((transformedSvgContent, transformer) => {
      return transformer(transformedSvgContent);
    }, svgContent);

  return transform(
    addTitle,
    removeFontFamily,
    removeFontSize,
    removeAriaLabels,
    removeFill,
    removeStyles,
    lowerCamelCaseAttr,
    updateXlinkHrefs
  );
}

function updateXlinkHrefs(svgContent: string) {
  return svgContent.replace(/xlink:href/gi, 'xlinkHref');
}

function removeFontFamily(svgContent: string) {
  return svgContent.replace(/(font-family|fontFamily)="(.*?)"/gi, '');
}

function removeFontSize(svgContent: string) {
  return svgContent.replace(/(font-size|fontSize)="(.*?)"/gi, '');
}

function removeStyles(svgContent: string) {
  return svgContent.replace(/style="(.*?)"/gi, '');
}

function removeFill(svgContent: string) {
  return svgContent.replace(/fill="(.*?)"/gi, '');
}

function removeAriaLabels(svgContent: string) {
  return svgContent.replace(/(aria-label|ariaLabel)="(.*?)"/gi, '');
}

function lowerCamelCaseAttr(svgContent: string) {
  return svgContent.replace(
    /([a-z]+)-([a-z])([a-z]+=)/g,
    (_, first, char, last) => {
      return `${first}${char.toUpperCase()}${last}`;
    }
  );
}

function addTitle(svgContent: string) {
  return svgContent.replace(/<title>.*<\/title>/g, '<title>{title}</title>');
}
