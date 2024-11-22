await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './build',
  target: 'bun'
});
