/*global module, require*/

(function () {
    'use strict';

    module.exports = function (grunt) {
        var BuildTask, oBuildTask, sBuild, sCompName, sDeploy;

        sBuild = grunt.option('build');
        sDeploy = grunt.option('deploy');

        if (sBuild) {
            /*
            ** Determine which build to use
            */
            if (sBuild === 'component') {
                sCompName = grunt.option('componentName');
                BuildTask = require('./grunt/build/component/' + sCompName);
            } else {
                BuildTask = require('./grunt/build/' + sBuild);
            }

        } else if (sDeploy) {
            BuildTask = require('./grunt/deploy/' + sDeploy);
        }

        oBuildTask = new BuildTask(grunt);
    };
}());
