const DicomElement = {
	PatientName: {
		Tag: 'x00100010',
		VR: 'PN',
		VM: '1',
		Desc: 'Patient Name'
	},
	PatientID: {
		Tag: 'x00100020',
		VR: 'LO',
		VM: '1',
		Desc: 'Patient ID'
	},
	PatientBirthDate: {
		Tag: 'x00100030',
		VR: 'DA',
		VM: '1',
		Desc: 'Patient Birthdate'
	},
	PatientSex: {
		Tag: 'x00100040',
		VR: 'CS',
		VM: '1',
		Desc: 'Patient Sex'
	}
};

module.exports = DicomElement;
