function EMDatarateChooserCalculate()
{
	var durationMinutes = parseFloat( window.document.forms['EMDatarateChooser']['hours'].value ) * 60 + parseFloat( window.document.forms['EMDatarateChooser']['mins'].value );
	var maxSize = EMDatarateChooserConvertUnitToMb( parseFloat( window.document.forms['EMDatarateChooser']['maxSize'].value ) );
	
	var durationSeconds = durationMinutes * 60;
	var resultMbps = maxSize / durationSeconds;
	var roundedResult = Math.round(resultMbps * 10) / 10;
	
	window.document.forms['EMDatarateChooser']['result'].value = roundedResult;
}

function EMDatarateChooserConvertUnitToMb(value)
{
	var unitName = window.document.forms['EMDatarateChooser']['units'].value;
	
	if (unitName == 'TB') return value * 8000000;
	if (unitName == 'GB') return value * 8000;
	if (unitName == 'MB') return value * 8;
	if (unitName == 'TiB') return value * 8 *1099511;
	if (unitName == 'GiB') return value * 8 * 1074;
	return result = value * 8 * 1.049;
}

