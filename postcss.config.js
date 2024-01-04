export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.EXEC_ENV === "development" ? { cssnano: {} } : {}),
  },
};
