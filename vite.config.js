import path from 'path';

export default ({
  root: path.resolve(__dirname, ''),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    open: true,
    index: "index.html",
    host: 'localhost',
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        home: path.resolve(__dirname, 'home.html'),
        list: path.resolve(__dirname, 'list.html'),
      },
    },
  },
})