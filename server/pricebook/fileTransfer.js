
let networkDrive = require("windows-network-drive");
const fs = require('fs-extra');
const path = require("path");
const util = require("util");
//const NETWORK_DRIVE_PATH = "//localhost/c$";
 
function pushFileToDrive (drive_path,source_file, dest_file, callback) {
Promise.resolve()

	/**
	 * Check if the drive is already mounted. Mount it if it is not.
	 */
	.then(() =>
	{
		console.log("Testing if '" + drive_path + "' is already mounted");
		return networkDrive.find(drive_path);
	})
	.then((driveLetters) =>
	{
		if (0 < driveLetters.length)
		{
			console.log("The drive is already mounted. Returning the first drive (" + driveLetters[0] + ") letter because they all point to the same place.");
			return driveLetters[0];
		}
		else
		{
			console.log("The path is not mounted. Mount the path");
			return networkDrive.mount(drive_path, 'X', undefined, undefined);
		}
	})

	/**
	 * Write the file to the network drive
	 */

	 .then((driveLetter) =>
	{
		//const pathToFile = path.join("./../../", "priceBook.zip")

		var destDrive = util.format('%s:\\', driveLetter);

		const pathToNewDestination = path.join(destDrive, "import", dest_file)
		console.log("Destination path: " + pathToNewDestination);
		try {

			fs.copyFile(source_file, pathToNewDestination, (err)=> {
				if (err){
					console.log("Failed To Copy the File");
					networkDrive.unmount(driveLetter)
					.then(function ()
					{
						//console.log("Vishnu Unmount Drive : "+driveLetter);
					})
					callback("Failed copied the file");
				} else {
					console.log("Successfully copied the file!!");
					networkDrive.unmount(driveLetter)
					.then(function ()
					{
						//console.log("Vishnu Unmount Drive : "+driveLetter);
					})
					callback("SUCCESS");
				}
			} );


			

		} catch(err) {
		throw err
		}
		
	})
	.catch((err) =>
	{
		console.error(err);
		callback("FAIL To Push the File");
	});
}

module.exports.pushFileToDrive = pushFileToDrive;




