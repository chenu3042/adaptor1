var file_system = require('fs');
var archiver = require('archiver');
   
var zipFile = function(sourceFile, zipfile) { 
 
    var output = file_system.createWriteStream(zipfile);
    var archive = archiver('zip');
    
    output.on('close', function () {
    console.log("sdir........." + sourceFile + "  zip file: "+ zipfile);
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
        });
    
    archive.on('error', function(err){
        throw err;
    });
    
    archive.pipe(output);
    
    // append files from a sub-directory and naming it `new-subdir` within the archive (see docs for more options):
    //archive.directory(sourceDir, false);
    //const file1 = __dirname + sourceFile;
    const file1 = sourceFile;
    console.log(sourceFile);
    archive.append(file_system.createReadStream(file1), { name:sourceFile });
    archive.finalize();
}
 
module.exports = zipFile;

