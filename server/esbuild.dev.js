const esbuild = require('esbuild');
async function watch() {
    let ctx = await esbuild.context({
        platform: 'node',
        entryPoints: ['./src/core/server.ts'],
        minify: false,
        outfile: './build/main-bundle.js',
        bundle: true,
        loader: { '.ts': 'ts' },
    });
    await ctx.watch();
    console.log('Watching...');
}

watch();
