// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'

// export default [
//   { ignores: ['dist'] },
//   {
//     files: ['**/*.{js,jsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...reactHooks.configs.recommended.rules,
//       'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//   },
// ]
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Bỏ qua thư mục build
  { ignores: ["dist", "build", "*.config.js"] },

  // Cấu hình chung cho tất cả file JS/JSX
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    // Áp dụng rules JS chuẩn
    ...js.configs.recommended,

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      // Rules từ plugin react-hooks
      ...reactHooks.configs.recommended.rules,

      // Bỏ lỗi unused-vars với component (tên viết hoa) và props bắt đầu bằng _
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z]", // Component React
          argsIgnorePattern: "^_", // _props, _e, ...
        },
      ],

      // Chỉ cho phép export component ở file Vite (Fast Refresh)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Một số rule nhẹ nhàng thường dùng trong dự án chat
      "no-console": "warn",
      "no-debugger": "error",
    },
  },
];
