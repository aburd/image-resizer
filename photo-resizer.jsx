//This script will start from a root folder and go through all folders inside of it to resize images and save as PSDs for further editing

// --------------------------------------------
// INITIAL DECLARATIONS AND SETTINGS FROM USER
// --------------------------------------------

//*********
//CHANGE ME
//*********
var sourcePath = '';
// i.e. var sourcePath = 'C:\\Users\\aburdick\\Desktop\\photo-test\\'

if(sourcePath == ''){
  throw new Error('Please change the root folder on line 10');
}

var width = prompt("width","","Input Width");
var height = prompt("Height","","Input Height");

var jpegOptions = new JPEGSaveOptions()
// set the jpeg quality really low so the files are small
jpegOptions.quality = 8;

// --------------------------------------------
// GET FOLDERS FROM SOURCE
// --------------------------------------------
var getFolders = function(path){
	var distilledFileList = [];
	var sourceFolder = new Folder(path);
	if(sourceFolder != null){
		var fileList = sourceFolder.getFiles();
	}

	for(var i = 0; i < fileList.length; i++){
		if(fileList[i] instanceof Folder && fileList[i].name != 'js' && fileList[i].name != 'output'){
			distilledFileList.push(fileList[i].name)
		}
	}

	return distilledFileList;
}

var folders = getFolders(sourcePath);

// --------------------------------------------
// MAIN FUNCTION -- Load the appropriate photos
// --------------------------------------------
var loadStack = function(folderName){

	// Directory which contains our pictures
	var sourceFolder = new Folder(sourcePath + folderName);

	// Get files in folder
	if(sourceFolder != null){
		var fileList = sourceFolder.getFiles();
	}

	//Only run if there are files in the folder
	if(fileList[0] instanceof File) {

		for(var i = 0; i < fileList.length; i++) {
			
			//Ignore DS_Store file
			if( fileList[i].name != '.DS_Store' ){

				// Open building photo resize to standard and name appropriately
				app.open(fileList[i]);
				d = app.activeDocument;
				d.activeLayer.name = 'photo1';
        
        // RESIZING
        // do the resizing.  if height > width (portrait-mode) resize based on width.  otherwise, resize based on height
        if ( parseInt(height) > parseInt(width) ) {
            d.resizeImage(null, UnitValue(width,"px"), null, ResampleMethod.BICUBIC);
        }
        else {
            d.resizeImage(UnitValue(width,"px"), null, null, ResampleMethod.BICUBIC);
        }
        d.resizeCanvas(UnitValue(width, 'px'), UnitValue(height, 'px'));
 
				// CREATE AND SAVE
        var psdFolder = Folder(sourcePath + folderName + '\\psd\\');
        var jpgFolder = Folder(sourcePath + folderName + '\\jpg\\');
        if(!psdFolder.exists){
          psdFolder.create();
        }
        if(!jpgFolder.exists){
          jpgFolder.create();
        }
				d.saveAs(new File(sourcePath + folderName + '\\psd\\' + fileList[i].name.replace(/\.jpg|\.png/g, '') + '.psd' ));
				var jpgPath = new File(sourcePath + folderName + '\\jpg\\' + fileList[i].name.replace(/\.jpg|\.png/g, '') + '.jpg');
        var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
        exportOptionsSaveForWeb.format = SaveDocumentType.JPEG;
        exportOptionsSaveForWeb.includeProfile = false;
        exportOptionsSaveForWeb.interlaced = true;
        exportOptionsSaveForWeb.optimized = true;
        exportOptionsSaveForWeb.quality = 80;
        d.exportDocument(jpgPath, ExportType.SAVEFORWEB,exportOptionsSaveForWeb);
        
        
        d.close(SaveOptions.DONOTSAVECHANGES);
			}
		}
	}

}

// Shift our front desk photo to the right
var doRows = function(){
	var d = app.activeDocument;
	var w = d.width;
	var h = d.height;
	d.resizeCanvas(w*2, h, AnchorPosition.TOPLEFT);
	d.artLayers.getByName('frontDesk').translate(w*1, 0);
	d.save();
}

// --------------------------------------------
// RUN PROGRAM
// --------------------------------------------
var makePhoto = function(folderName){
	var d;
	loadStack(folderName);	
}

// Loop through all the appropriate folders
for(var q = 0; q < folders.length; q++){
	makePhoto(folders[q]);
}

// By aburdick burdick.aaron@gmail.com