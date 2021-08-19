const { src, dest, watch, parallel, series } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat"); // concat меняет с .css на .min.css
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autopref = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const clean = require('gulp-clean');

// Обнавляет браузер в реальном времени
function browserSyncFunction() {
    browserSync.init({
        server: {
            baseDir: "app/",
        },
    });
}

// Удаляет папку dist
function cleanDist() {
    return src('dist', { read: false })
        .pipe(clean());
}

// Сжимает изображения
function images() {
    return src("app/img/**/*")
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
                }),
            ])
        )
        .pipe(dest("dist/images"));
}

// Сжимает файлы JavaScript
function scripts() {
    return src(["app/js/jquery-3.6.0.min.js", "app/js/slick.min.js", "app/js/script.js"])
        .pipe(concat("script.min.js")) // Сжимает
        //.pipe(uglify()) // JS компрессор, сжимает js файл
        .pipe(dest("app/js")) // Выкидывает в папку js сжатый файл
        .pipe(browserSync.stream()); // Обновляет страницу
}

// Сжимает style.css
function styles() {
    return src("app/sass/style.sass") // Находим файл
        .pipe(sass({ outputStyle: "compressed" })) // Выходит уже style.css
        .pipe(concat("style.min.css"))
        .pipe(
            autopref({
                overrideBrowserslist: ["Last 10 version"], // Чтобы на старых браузерах поддержка была
                grid: true,
            })
        )
        .pipe(dest("app/css")) // Помещаем в папку
        .pipe(browserSync.stream());
}

// Билдит проект
function build() {
    return src(
        [
            "app/css/style.min.css",
            "app/fonts/**/*",
            "app/js/script.min.js",
            "app/**/*.html",
        ],
        { base: "app" }
    ).pipe(dest("dist"));
}

// Обновляет файлы в реальном времени
function watching() {
    watch(["app/sass/**/*.sass"], styles);
    watch(["app/js/**/*.js", "!app/js/script.min.js"], scripts); // ! знак кроме этого файла означает
    watch(["app/*.html"]).on("change", browserSync.reload);
}

// Экспортируем
exports.styles = styles;
exports.watching = watching;
exports.browserSyncFunction = browserSyncFunction;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

// параллель
exports.default = parallel(styles, scripts, browserSyncFunction, watching);

// Сделал последовательность
exports.build = series(cleanDist, images, build);