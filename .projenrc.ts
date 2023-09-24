import { TypeScriptProject } from '@vladcos/projen-base'

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  devDeps: [
    '@vladcos/projen-base',
    '@types/lodash',
    'astro',
    '@astrojs/tailwind',
    '@astrojs/react',
    '@astrojs/node',
  ],
  tsconfigDev: {
    compilerOptions: {
      module: 'es2022',
    },
  },
  name: 'merge-strategy',
  projenrcTs: true,
  vitest: true,
  packemon: true,
  deps: ['lodash'] /* Runtime dependencies of this module. */,
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
})
project.synth()
