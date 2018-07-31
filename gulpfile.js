const gulp = require('gulp')
const babel = require('gulp-babel')
//const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync')
const del = require('del')
const plumber = require('gulp-plumber')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const htmlreplace = require('gulp-html-replace')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

const paths = {
  src: {
    'root': './statik/',
    'js': './statik/scripts/',
    'css': './statik/styles/'
  },
  dist: {
    'root': './dist/',
    'js': './dist/scripts/',
    'css': './dist/styles/'
  }
}

gulp.task('clean', () => del(`${paths.dist.root}**/*`) )

gulp.task('copy', ['clean'], () => {
  return gulp.src([
    `${paths.src.root}**/*`,
    `!${paths.src.css}**/*.css`,
    `!${paths.src.js}**/*.js`,
  ], {"base": paths.src.root})
    .pipe(gulp.dest(paths.dist.root))
})

gulp.task('css', () => {
return gulp.src(`${paths.src.css}**/*.css`)
    .pipe(plumber())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(paths.dist.css))
})

const minifyJs = (filename) => {
  return gulp.src(`${paths.src.js}${filename}.js`)
    .pipe(plumber())
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename(`${filename}.min.js`))
    .pipe(gulp.dest(paths.dist.js))
}

gulp.task('js:vendor', () => {
  return minifyJs('vendor')
})
gulp.task('js:app', () => {
  return minifyJs('app')
})

gulp.task('htmlreplace', () => {
  return gulp.src(`${paths.src.root}**/*.html`)
    .pipe(htmlreplace({
      'css': '/styles/main.min.css',
      'js-vendor': '/scripts/vendors.min.js',
      'js-app': '/scripts/app.min.js'
    }))
    .pipe(gulp.dest(paths.dist.root));
})

gulp.task('server', () => {
  console.log('server')

  browserSync.init({
    server: {
      baseDir: paths.src.root
    }
  })

  gulp.watch([
    `${paths.src.root}**/*`
  ]).on('change', browserSync.reload)
})

gulp.task('build', ['copy'], () => {
  gulp.start('js:vendor', 'js:app', 'css', 'htmlreplace')
})

gulp.task('default', ['server'], () => {
  console.log('server is running...')
})


