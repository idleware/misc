module.exports = {
  buildCmd: 'yarn build',
  testCmd: 'yarn test',
  npmFetch: true,
  tagFormat: 'pure',
  meta: 'asset',
  ghAssets: [
    {name: 'lcov.info', source: 'target/coverage/lcov.info'},
  ],
  // What parcel manifests may look like once the courier substitutes env: every endpoint is pinned,
  // and no other field may carry a GitHub token or a runner JWT (e.g. into release notes or a tagger name).
  populate: {
    schemas: {
      text:     {type: 'string', pattern: /(?![\s\S]*(?:gh[opsur]_|github_pat_|eyJ))[\s\S]*/.source},
      secret:   {type: 'secret'},
      sha:      {type: 'string', pattern: '[0-9a-f]{40}'},
      repo:     {const: 'idleware/misc'},
      repoUrl:  {type: 'url', protocol: 'https:', hostname: 'github.com', pathname: {pattern: '/idleware/misc(\\.git)?'}, username: {}, password: {}},
      ghApi:    {const: 'https://api.github.com'},
      registry: {enum: ['', 'https://registry.npmjs.org', 'https://registry.npmjs.org/']},
      oidc:     {const: 'true'},
      ghPages:  {const: 'gh-pages'},
      dir:      {type: 'string', pattern: '[a-z0-9-]+'},
      asset:    {const: 'asset'},
    },
    channels: {
      '*':          {'*': {schema: 'text'}, repoName: {schema: 'repo'}, repoAuthedUrl: {schema: 'repoUrl'}, ghBasicAuth: {schema: '*'}},
      'git-tag':    {sha: {schema: 'sha'}},
      npm:          {registry: {schema: 'registry'}, oidc: {schema: 'oidc'}},
      'gh-release': {token: {schema: 'secret'}, apiUrl: {schema: 'ghApi'}, assets: {schema: '*'}},
      'gh-pages':   {branch: {schema: 'ghPages'}, to: {schema: 'dir'}},
      meta:         {type: {schema: 'asset'}, data: {schema: '*'}},
    },
  },
}
