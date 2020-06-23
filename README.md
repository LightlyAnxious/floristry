# Сборка для сайта "Весна всегда"

## Краткая инструкция по работе

### Для начала работы у вас должент быть установлен:

- Node.js v.10.15.3
- Gulp v4
- npm last version

## Структура проекта

```
floristry
├── source
│   ├── css
│   ├── fonts
│   ├── img
│   ├── pug
│   ├── js
│   ├── sass
│   ├── gulp
│   └── index.html
│   └── compositions.html
│   └── decoration.html
│   └── events.html
│   └── gallery.html
│   └── wedding.html
├── package.json
├── README.md
├── gulpfile.js
├── webpack.config.js
├── .browserslistrc
├── .prettierrc
├── .prettierignore
├── .eslintrc
├── .eslintignore
├── .pug-lintrc.json
├── .stylelintrc
├── .stylelintignore
└── .gitignore
└──
```

## Основные команды для работы

- Установка - `npm i`
- Сборка проекта без запуска локального сервера - `npm run build`
- Запуск локального сервера - `npm start`
- Запуск тестирования на соответствия код-гайдам - `npm test`
