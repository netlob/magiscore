function readFile(fileEntry) {
    return new Promise((resolve, reject) => {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function () {
                resolve(this.result);
            };

            reader.readAsText(file);

        }, onErrorReadFile);
        function onErrorReadFile(evt) {
            reject(evt.target.error.code);
        }
    })
}

function listFiles() {

    return new Promise((resolve, reject) => {
        document.addEventListener("deviceready", function() { 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
    
        function onFileSystemSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;
            directoryEntry.getDirectory("", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail);
        }
        
        function onDirectorySuccess(parent) {
            var directoryReader = parent.createReader();
            directoryReader.readEntries(success, fail);
        }
    
        function success(entries) {
            resolve(entries.filter((entry) => entry.isFile == true));
        }
        
        function fail(error) {
            reject("Failed to list directory contents: " + error.code);
        }
        
        function onDirectoryFail(error) {
            reject("Unable to create new directory: " + error.code);
        }
        
        function onFileSystemFail(evt) {
            reject(evt.target.error.code);
        }
    },false)
      });

}

function WriteFile(jsondata, fileEntry) {

    return new Promise((resolve, reject) => {
        document.addEventListener("deviceready", function() { 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function() {
                    resolve(fileEntry);
                };
          
                fileWriter.onerror = function (e) {
                    reject("Failed file write: " + e.toString());
                };

                dataObj = new Blob([jsondata], { type: 'application/json' });
          
                fileWriter.write(dataObj);
            });
        }, onFileSystemFail);
                
        function onFileSystemFail(evt) {
            reject(evt.target.error.code);
        }
    },false)
})
}

function CreateNewFile (id) {
    
    return new Promise((resolve, reject) => {
        document.addEventListener("deviceready", function() { 
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            
            if (typeof id != 'undefined') fs.root.getFile(`${id}.json`, { create: true, exclusive: false }, function (fe) {resolve(fe)}, fail)

        }, fail)

        function fail (err) { reject(err) }
    },false)
    })

}

function PurgeAllFiles(enteries) {

    return new Promise(async (resolve, reject) => {

        for (fileEntry of enteries) {
            await RemoveFile(fileEntry);
        }
        resolve();

    })

}

function RemoveFile(fileEntry) {
    return new Promise((resolve, reject) => {
        fileEntry.remove(function (file) { resolve() }, removeerror);
        function removeerror(evt) {
            reject(evt);
        }
    })
} 