var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = require('browser-sync').reload;

var path = {
	dist: {
		html: 'dist/',
		js: 'dist/js/',
		css: 'dist/css/',
		img: 'dist/img/',
		fonts: 'dist/fonts/'
	},
	src: {
		html: 'src/*.jade',
		js: 'src/js/main.js',
		style: 'src/css/*.sass',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.jade',
		js: 'src/js/**/*.js',
		style: 'src/css/**/*.sass',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './dist'
};

var serverConfig = {
	server: {
		baseDir: "./dist"
	},
	tunnel: false,
	host: 'localhost',
	port: 63341,
	logPrefix: "browser-sync"
};

// SASS
gulp.task('sass', function () {
	gulp.src(path.src.style)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.dist.css))
		.pipe(reload({stream:true}));
});

// JADE
gulp.task('jade', function(){
	gulp.src(path.src.html)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({stream:true}));
});

// SCRIPTS
gulp.task('scripts', function(){
	gulp.src(path.src.js)
		.pipe(gulp.dest(path.dist.js))
		.pipe(reload({stream:true}));
});

// IMAGES
gulp.task('images', function(){
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.dist.img));
});

// FONTS
gulp.task('fonts', function(){
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.dist.fonts));
});

// SERVER
gulp.task('browser-sync', function() {
	browserSync.init(serverConfig);
});

// WATCH
gulp.task('watch', function(){
	gulp.watch(path.watch.html, ['jade']);
	gulp.watch(path.watch.style, ['sass']);
	gulp.watch(path.watch.js, ['scripts']);
});

gulp.task('default', ['sass', 'jade', 'scripts', 'images', 'fonts', 'browser-sync', 'watch']);
