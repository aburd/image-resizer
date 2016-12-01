//This script will start from a root folder and go through all folders inside of it to resize images and save as PSDs for further editing

// --------------------------------------------
// INITIAL DECLARATIONS AND SETTINGS FROM USER
// --------------------------------------------

var sourcePath = $.fileName;
var splitPath = sourcePath.split('/');
splitPath.pop();
sourcePath = splitPath.join('/') + "/"
var fileExtReg = /(\.jpg|\.jpeg|\.tiff|\.tif|\.gif|\.png|\.bmp)/ig;

if(sourcePath == ''){
  throw new Error('Please change the root folder on line 10');
}

var width = prompt("Input Width in pixels","","Width");
var height = prompt("Input Height in pixels","","Height");
var jpgQuality = prompt("Input jpeg quality", "", "1-10");
if(jpgQuality < 1 || jpgQuality > 10) {
	jpgQuality = prompt("Input jpeg quality", "", "1-10");
}
var addPath = prompt("Any additional path inside folders? Leave blank if folder with pictures is only one folder deep.","","folder name");

var jpegOptions = new JPEGSaveOptions()
// set the jpeg quality really low so the files are small
jpegOptions.quality = 8;

// --------------------------------------------
// GET FOLDERS FROM SOURCE
// --------------------------------------------
var getFolders = function(path){
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
var loadStack = function(folderName, additionalPath){
  additionalPath = additionalPath || '';
	// Directory which contains our pictures
  if(additionalPath !== ''){
    var sourceFolder = new Folder(sourcePath + folderName + '/' + additionalPath + '/');  
  }
  else {
    var sourceFolder = new Folder(sourcePath + folderName + '/');  
  }
	

	// Get files in folder
	if(sourceFolder != null){
		var fileList = sourceFolder.getFiles();
	}

	//Only run if there are files in the folder
	if(fileList[0] instanceof File) {

		for(var i = 0; i < fileList.length; i++) {
			
			var img = fileList[i].name.match(fileExtReg);
      //Ignore DS_Store file and non-images
      if( fileList[i].name != '.DS_Store' && img != null ){

				// Open building photo resize to standard and name appropriately
				app.open(fileList[i]);
				d = app.activeDocument;
				d.activeLayer.name = 'photo1';
        
        // RESIZING
        // do the resizing.  if height > width (portrait-mode) resize based on width.  otherwise, resize based on height
        if ( parseInt(height) > parseInt(width) ) {
            d.resizeImage(null, UnitValue(height,"px"), null, ResampleMethod.BICUBIC);
        }
        else {
            d.resizeImage(UnitValue(width,"px"), null, null, ResampleMethod.BICUBIC);
        }
				// Only resize the canvas if both a height and width are not empty
        if(height !== "" && width !== ""){
					d.resizeCanvas(UnitValue(width, 'px'), UnitValue(height, 'px'));
				}
 
				// CREATE AND SAVE
        var psdFolder = Folder(sourceFolder + '/psd/');
        var jpgFolder = Folder(sourceFolder + '/jpg/');
        if(!psdFolder.exists){
          psdFolder.create();
        }
        if(!jpgFolder.exists){
          jpgFolder.create();
        }
				d.saveAs(new File(sourceFolder + '/psd/' + fileList[i].name.replace(fileExtReg, '') + '.psd' ));
				var jpgPath = new File(sourceFolder + '/jpg/' + fileList[i].name.replace(fileExtReg, '') + '.jpg');
        var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
        exportOptionsSaveForWeb.format = SaveDocumentType.JPEG;
        exportOptionsSaveForWeb.includeProfile = false;
        exportOptionsSaveForWeb.interlaced = true;
        exportOptionsSaveForWeb.optimized = true;
        exportOptionsSaveForWeb.quality = jpgQuality * 10;
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
	loadStack(folderName, addPath);	
}

// Loop through all the appropriate folders
for(var q = 0; q < folders.length; q++){
	makePhoto(folders[q]);
}

// By aburdick burdick.aaron@gmail.com