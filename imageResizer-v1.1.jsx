// Copyright Aaron Burdick 2016
// This software is licensed under MIT. Feel free to edit or add-on for yourself.

// This script will recursively go through all folders and resize images and save as JPGs and PSDs for further editing

// --------------------------------------------
// INITIAL DECLARATIONS AND SETTINGS FROM USER
// --------------------------------------------
var sourcePath = $.fileName;
var splitPath = sourcePath.split('/');
splitPath.pop();
sourcePath = splitPath.join('/') + "/";
var fileExtReg = /(\.jpg|\.jpeg|\.tiff|\.tif|\.gif|\.png|\.bmp)/ig;

if( sourcePath == '' ) {
  throw new Error('Please change the root folder on line 10');
}

// Get initial dimensions
var width = prompt("Input Width in pixels","","Width");
var height = prompt("Input Height in pixels","","Height");
var jpgQuality = prompt("Input jpeg quality", "", "1 - 10");
if(jpgQuality < 1 || jpgQuality > 10) {
	jpgQuality = prompt("Input jpeg quality", "", "1 - 10");
}



// Get current dir files and begin iteration
function getDirContents(path) {
	var fileList = [];
	var sourceFolder = new Folder(path);
	if( sourceFolder !== null ){
		fileList = sourceFolder.getFiles();
		// iterate through the files and call function recursively for directories
		for( var i = 0; i < fileList.length; i++ ) {
			var curFile = fileList[i]; 
			
			if( curFile instanceof Folder ) {
				getDirContents(curFile);
			} else if( fileExtReg.test(curFile.name) ) {
				makeJpgPsd(curFile, sourceFolder);
			}
			
		}
	}
}

// Make JPG and PSD for file
function makeJpgPsd(image, source) {
	if( image instanceof File ) {
		app.open(image);
		d = app.activeDocument;
		d.activeLayer.name = 'photo1';
		
		// RESIZING
		// do the resizing.  if height > width (portrait-mode) resize based on width.  otherwise, resize based on height
		if ( parseInt(height) >= parseInt(width) ) {
			// Check to see the dimensions of the actual picture to see the best way to resize
			if(d.height > d.width) {
				d.resizeImage(UnitValue(width,"px"), null, null, ResampleMethod.BICUBIC);
			} else {
				d.resizeImage(null, UnitValue(height,"px"), null, ResampleMethod.BICUBIC);	
			}
		}
		else {
			// Check to see the dimensions of the actual picture to see the best way to resize
			if(d.width > d.height) {
				d.resizeImage(null, UnitValue(height,"px"), null, ResampleMethod.BICUBIC);	
			} else {
				d.resizeImage(UnitValue(width,"px"), null, null, ResampleMethod.BICUBIC);
			}
		}
		// Only resize the canvas if both a height and width are not empty
		if(height !== "" && width !== ""){
			d.resizeCanvas(UnitValue(width, 'px'), UnitValue(height, 'px'));
		}
		
		// CREATE AND SAVE
		var psdFolder = Folder(source + '/psd/');
		var jpgFolder = Folder(source + '/jpg/');
		if(!psdFolder.exists){
			psdFolder.create();
		}
		if(!jpgFolder.exists){
			jpgFolder.create();
		}
		d.saveAs(new File(psdFolder + '/' + image.name.replace(fileExtReg, '') + '.psd' ));
		var jpgPath = new File(jpgFolder + '/' + image.name.replace(fileExtReg, '') + '.jpg');
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

// Main
(function(){
	getDirContents(sourcePath);
})();