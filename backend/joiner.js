/**
 * Join file after upload is done
 */
var _ = require('underscore');
var concat = require('concat-files');
var path = require('path');
var extensionPattern = new RegExp(/\.[0-9a-z]{1,5}$/i);
var fs = require('fs');

/**
 * Get extension
 */
var getExtension = function (filename) {
  var extension = filename.match(extensionPattern);

  if (_.size(extension) === 1)
    return extension[0];
  return;
};

/**
 * Remove old files
 */
var removeOldTrunks = function (files) {
  _.each(files, function (file) {
    fs.unlinkSync(file);
  });
};

/**
 * Join file
 */
var joinUploadParts = function (filename, identifier) {
  var extension = getExtension(filename);
  var dir = fs.readdirSync('./trunk');
  var files = [];
  var sumFile = identifier + extension;

  // gather files
  _.each(dir, function (file) {
    if (file.indexOf(identifier) !== -1)
      files.push(path.join(__dirname, 'trunk', file));
  });

  if (_.size(files) > 0) {
    // join files
    concat(files, './complete-file/' + sumFile, function (err) {
      // remove files
      removeOldTrunks(files);
      console.log('done');
    });
  }
};

module.exports = joinUploadParts;