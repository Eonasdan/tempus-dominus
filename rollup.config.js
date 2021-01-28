import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/js/tempus-dominus.ts',
    output: {
        dir: 'src/docs',
        format: 'umd',
        name: 'tempusdominus'
    },
    plugins: [typescript()],
};