require('esbuild')
    .build({
        platform: 'node',
        entryPoints: ['./src/core/server.ts'],
        outfile: './build/main-bundle.js',
        bundle: true,
        loader: { '.ts': 'ts' },
        minify: true,
    })
    .then(() => console.log('⚡ Done'))
    .catch(() => process.exit(1));
