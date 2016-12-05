##Description

**This script takes a path and dimensions and converts all image files inside of that path**

##How to Use

1. Git clone
2. Open script with Adobe Photoshop CS2015 (may work with other versions, I have not tested)
3. Input information
4. Look at 'er go.

05.12.2016
- Added a prompt to input path. Copy and pasting file to root of every directory was becoming troublesome. However, in the absence of a path, the code will still get the path of the root that this file is in and attempt to start conversion of image files.
- Corrected a bug that would look through folders named ‘jpg’ and ‘psd’ which are the folders that this script creates.

01.12.2016
- Added folder recursion so that the script will go through to the end of every path looking for images.
- Made improvements to resizing.  The script now checks the dimensions of the source image itself to ensure that all images are resized sensibly. e.g. A source image with a greater height will be resized based on its width so that you can adjust on the PSD if necessary.