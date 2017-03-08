var fs = require('fs-extra');
var mime = require('mime');
var async = require('async');
var mongoose = require('mongoose');
var mkdirp = require('mkdirp');
var Resource = require('./models/resource.model');
 
if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " path/from/directory" + " path/to/directory");
    process.exit(-1);
}

mongoose.connect('mongodb://localhost/atlas-dev');
mongoose.connection.on('error', function(err) {
  console.error('MongoDB main database connection error: ' + err);
  process.exit();
});

var path = process.argv[2];
var toPath = process.argv[3];
console.log('TO PATH',toPath);
var now = new Date();
var name = 'docket';
var resource_type = 'resource';
var systemId = '58bebad20fd02a24f4ca4d6a';
var file, item, extension, originalName, i, j, subPath, resource, toPathFinal;

fs.readdir(path, function(err, items) {

    async.eachSeries(items, function (item, callback) {
        file = path + '/' + item;
        fs.stat(file, function(err,stats) {
            if (stats.isDirectory()) {
                fs.readdir(file, function(err, subItems) {
                    async.eachSeries(subItems, function (subItem, callback1) {
                        resource = {
                            name: name,
                            resource_type: resource_type,
                            resource_id: item,
                            filename: subItem,
                            mime_type: mime.lookup(subItem),
                            size: stats["size"],
                            original_name: name + '.' + subItem.slice(-3),  
                            extension: '.' + subItem.slice(-3),
                            log: [],
                            created_by: systemId,
                            amended_by: systemId,
                            active: true
                        }
                        toPathFinal = toPath + '/' + resource_type + '/' + item;
                        mkdirp(toPathFinal, function (err) {
                            fs.copy(file + '/' + subItem, toPathFinal + '/' + subItem, function (err) {
                                if (err) return console.error(err);
                                var newResource = new Resource(resource);
                                newResource.save(function(err) {
                                    if (err) return console.error(err);
                                    console.log(resource.name);
                                    callback1();
                                });
                            });
                        });
                    }, function(err) {
                        callback();
                    });
                });
            } else {
                callback();
            }
        })
    }, function(err) {
        console.log('finished');
    });

});
