module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "./src/assets",
            src: ["**"],
            dest: "./dist/assets"
          }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ["src/server/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist/server"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: true
        }
      }
    },
    watch: {
      ts: {
        files: ["src/server/**/*.ts"],
        tasks: ["ts"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "copy",
    "ts"
  ]);

};