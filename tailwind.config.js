/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#14213d",
          coral: "#f97360",
          peach: "#fff1e8",
          gold: "#ffcb77",
          mint: "#d5f2ea",
        },
      },
      boxShadow: {
        card: "0 20px 45px rgba(20, 33, 61, 0.10)",
      },
      fontFamily: {
        display: ['"Baloo 2"', "cursive"],
        body: ['"Outfit"', "sans-serif"],
      },
      backgroundImage: {
        confetti:
          "radial-gradient(circle at 15% 20%, rgba(255, 203, 119, 0.28) 0, rgba(255, 203, 119, 0.28) 18%, transparent 19%), radial-gradient(circle at 80% 10%, rgba(249, 115, 96, 0.18) 0, rgba(249, 115, 96, 0.18) 16%, transparent 17%), linear-gradient(135deg, #fffdf8 0%, #fff2eb 52%, #fff9f2 100%)",
      },
    },
  },
  plugins: [],
};
