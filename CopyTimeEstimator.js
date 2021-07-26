
function EMCopytimeCalculate()
	{
	var dataSize = EMCopytimeConvertUnit( parseFloat( window.document.forms['EMCopytime']['copyGB'].value ) );
	if (dataSize == 0) return;
	
	var sourceSpeed = parseFloat( window.document.forms['EMCopytime']['copysource'].value );
	if (sourceSpeed == 0) sourceSpeed = parseFloat( window.document.forms['EMCopytime']['sourceCustom'].value );
	var destSpeed = parseFloat( window.document.forms['EMCopytime']['copydest'].value );
	if (destSpeed == 0) destSpeed = parseFloat( window.document.forms['EMCopytime']['destCustom'].value );
	
	var copySpeed = sourceSpeed;
	if (destSpeed < copySpeed) copySpeed = destSpeed;
	
	var totalSeconds = dataSize / copySpeed;
	var hourFraction = totalSeconds / 3600;
	var hours = Math.floor(hourFraction);
	var minutes = parseInt(60 * (hourFraction - hours));
	
	window.document.forms['EMCopytime']['copyhours'].value = hours;
	window.document.forms['EMCopytime']['copymins'].value = minutes;
	}

function EMCopytimeConvertUnit(value)	//convert to MB
	{
	var unitName = window.document.forms['EMCopytime']['units'].value;
	
	if (unitName == 'TB') return value * 1000000;
	if (unitName == 'GB') return value * 1000;
	if (unitName == 'MB') return value;
	if (unitName == 'TiB') return value * 1099511;
	if (unitName == 'GiB') return value * 1074;
	return value * 1.049;
	}

function EMCopytimeCheckSource()
	{
	var sourceSpeed = parseFloat( window.document.forms['EMCopytime']['copysource'].value );
	if (sourceSpeed == 0) window.document.forms['EMCopytime']['sourceCustom'].disabled = false;
	else window.document.forms['EMCopytime']['sourceCustom'].disabled = true;
	}

function EMCopytimeCheckDest()
	{
	var destSpeed = parseFloat( window.document.forms['EMCopytime']['copydest'].value );
	if (destSpeed == 0) window.document.forms['EMCopytime']['destCustom'].disabled = false;
	else window.document.forms['EMCopytime']['destCustom'].disabled = true;
	}
