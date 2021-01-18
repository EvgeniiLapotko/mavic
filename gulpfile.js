const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const cssmin = require('gulp-cssmin');
const soursemaps = require('gulp-sourcemaps')

// function images() {
//     return src('app/images/**/*')
//         .pipe(imagemin([
//             imagemin.gifsicle({ interlaced: true }),
//             imagemin.mozjpeg({ quality: 75, progressive: true }),
//             imagemin.optipng({ optimizationLevel: 5 }),
//             imagemin.svgo({
//                 plugins: [
//                     { removeViewBox: true },
//                     { cleanupIDs: false }
//                 ]
//             })
//         ]))
//         .pipe(dest('dist/images'))
// }

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat("style.min.css"))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream());
}

function stylesLib() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/fullpage.js/dist/fullpage.css'
    ])
        .pipe(concat('libs.min.css'))
        .pipe(cssmin())
        .pipe(dest('app/css'))
}


function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(soursemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(soursemaps.write())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

function scriptsLib() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/fullpage.js/dist/fullpage.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/libs'))
}

function build() {
    return src([
        'app/css/*.css',
        'app/fonts/**/*',
        'app/js/**/*.js',
        '!app/js/main.js',
        'app/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}



exports.styles = styles;
exports.stylesLib = stylesLib;
exports.scripts = scripts;
exports.scriptsLib = scriptsLib;
exports.watching = watching;
exports.browsersync = browsersync;
// exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build);
exports.default = parallel(styles, stylesLib, scripts, scriptsLib, browsersync, watching);