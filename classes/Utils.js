const fs = require('fs');
const dcmParser = require('dicom-parser');

class Utils {
	//
	// dateString format: "YYYYMMDD"
	//
	static getDateStringWithHypens(dtString) {
		return !dtString || dtString.length !== 8 ? '' : dtString.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
	}

	static getTimeStringWithColons(tmString) {
		return !tmString || tmString.length < 6
			? ''
			: tmString.substring(0, 6).replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3');
	}

	static loadFile(filename) {
		return new Promise((resolve, reject) => {
			fs.readFile(filename, (err, data) => {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			});
		});
	}

	static async getDicomDataSet(filename) {
		const dcmData = await Utils.loadFile(filename);
		const byteArray = new Uint8Array(dcmData);
		return dcmParser.parseDicom(byteArray);
	}
}

module.exports = Utils;
