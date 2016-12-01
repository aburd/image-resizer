This script will start from a root folder and go through all folders inside of it to resize images and save as PSDs for further editing

1. git clone 
2. Run the './imageResizer-v1.jsx' script through photoshop.
3. Check the contents of './TestFolder/' to see the general purpose of this script.

01.12.2016
- Added folder recursion so that the script will go through to the end of every path looking for images.
- Made improvements to resizing.  The script now checks the dimensions of the source image itself to ensure that all images are resized sensibly. e.g. A source image with a greater height will be resized based on its width so that you can adjust on the PSD if necessary.
