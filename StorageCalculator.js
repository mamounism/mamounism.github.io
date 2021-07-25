var codecDB;

function EMStorageCalculatorLoadCoDecs()
	{
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
		{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
			codecDB = JSON.parse(xmlhttp.responseText);
			EMStorageCalculatorDisplayCodecOptions();
			//alert("Loaded info for " + codecDB.length + " resolutions");
			}
		}
	
	xmlhttp.open("GET", "https://mamounism.github.io/CodecList.json", true);
	xmlhttp.send();
	}


function EMStorageCalculatorSelectHasOption(select, option)
	{
	var i;
	for (i=0; i<select.options.length; i++)
		{
		if (select.options[i].value == option) return true;
		}
	
	return false;
	}


function EMStorageCalculatorUpdateFramerates()
	{
	var prevFps = window.document.forms['EMSCForm']['fps'].value;
	
	window.document.forms['EMSCForm']['fps'].options.length = 0;
	window.document.forms['EMSCForm']['fps'].options[0] = new Option("Framerate", "0");
	window.document.forms['EMSCForm']['fps'].options[0].disabled = true;
	
	if ( window.document.forms['EMSCForm']['resolution'].value == "sd")
		{
		window.document.forms['EMSCForm']['fps'].options[1] = new Option("50i (PAL)", "25");
		window.document.forms['EMSCForm']['fps'].options[2] = new Option("59.94i (NTSC)", "29.97");
		}
	else
		{
		if ( window.document.forms['EMSCForm']['resolution'].value.indexOf("ARRIRAW") > -1 )
			{
			window.document.forms['EMSCForm']['fps'].options[1] = new Option("1", "1");
			window.document.forms['EMSCForm']['fps'].options[2] = new Option("12", "12");
			window.document.forms['EMSCForm']['fps'].options[3] = new Option("24", "24");
			window.document.forms['EMSCForm']['fps'].options[4] = new Option("25", "25");
			window.document.forms['EMSCForm']['fps'].options[5] = new Option("30", "30");
			window.document.forms['EMSCForm']['fps'].options[6] = new Option("48", "48");
			window.document.forms['EMSCForm']['fps'].options[7] = new Option("60", "60");
			}
		else
			{
			window.document.forms['EMSCForm']['fps'].options[1] = new Option("23.98p / 24p", "24");
			window.document.forms['EMSCForm']['fps'].options[2] = new Option("25p / 50i", "25");
			window.document.forms['EMSCForm']['fps'].options[3] = new Option("29.97p / 30p / 59.94i / 60i", "30");
			window.document.forms['EMSCForm']['fps'].options[4] = new Option("48p", "48");
			window.document.forms['EMSCForm']['fps'].options[4] = new Option("50p", "50");
			window.document.forms['EMSCForm']['fps'].options[5] = new Option("59.94p / 60p", "60");
			}
		}
	
	if (!isNaN(prevFps) && selectHasOption(window.document.forms['EMSCForm']['fps'], prevFps))
		{
		window.document.forms['EMSCForm']['fps'].value = prevFps;
		}
	else
		{
		window.document.forms['EMSCForm']['fps'].value = 0;
		}
	}


function EMStorageCalculatorDisplayCodecOptions()
	{
	if (window.document.forms['EMSCForm']['resolution'].value == "Resolution") return;
	
	if ( window.document.forms['EMSCForm']['resolution'].value == "custom")
		{
		window.document.getElementById("customSize").style.display = "table-row";
		}
	else
		{
		var row = window.document.getElementById("customSize");
		if (row) row.style.display = "none";
		}
	
	window.document.forms['EMSCForm']['videocodec'].options.length = 0;
	
	if (!codecDB)
		{
		window.document.forms['EMSCForm']['videocodec'].options[0] = new Option("Failed to load CoDecs", "0");
		return;
		}
	
	var resolutionData;
	var i = 0;
	//alert("searching for " + window.document.forms['EMSCForm']['resolution'].value);
	for (i=0; i<codecDB.length; i++)
		{
		if (codecDB[i].resolution == window.document.forms['EMSCForm']['resolution'].value)
			{
			//alert("Found " + codecDB[i].resolution);
			resolutionData = codecDB[i];
			break;
			}
		//else alert("...not " + codecDB[i].resolution);
		}
	
	if (!resolutionData)
		{
		//alert("Resolution data not found for "+ window.document.forms['EMSCForm']['resolution'].value);
		return;
		}
	//else alert("Resolution data found for "+ window.document.forms['EMSCForm']['resolution'].value + " - have " + resolutionData.codecs.length + "values");
	
	if ( window.document.forms['EMSCForm']['resolution'].value == "custom")
		{
		var optionIndex = 0;
		for (i=0; i<resolutionData.codecs.length; i++)
			{
			var codec = resolutionData.codecs[i];
			if (codec.framerate == 0)
				{
				window.document.forms['EMSCForm']['videocodec'].options[optionIndex] = new Option(codec.name, codec.datarate);
				optionIndex++;
				}
			}
		}
	else
		{
		var framerate = window.document.forms['EMSCForm']['fps'].value;
		var optionIndex = 0;
		for (i=0; i<resolutionData.codecs.length; i++)
			{
			var codec = resolutionData.codecs[i];
			if ((codec.framerate == 0) || (codec.framerate == framerate))
				{
				var roundedMBps = Math.round((codec.datarate/8)*10) / 10;
				var name = codec.name + " (" + roundedMBps + " MB/s)";
				window.document.forms['EMSCForm']['videocodec'].options[optionIndex] = new Option(name, codec.datarate);
				optionIndex++;
				}
			}
		}
	}


function EMStorageCalculatorFindDatarate()
	{
	var datarate = 0.0;
	
	if (window.document.forms['EMSCForm']['video'].checked == true)
		{
		if ( window.document.forms['EMSCForm']['resolution'].value == "custom")
			{
			var framerate = window.document.forms['EMSCForm']['fps'].value;
			var width = parseInt( window.document.forms['EMSCForm']['customWidth'].value );
			window.document.forms['EMSCForm']['customWidth'].value = width;
			var height = parseInt( window.document.forms['EMSCForm']['customHeight'].value );
			window.document.forms['EMSCForm']['customHeight'].value = height;
			var pixels = width * height;
			var baseBitsPerFrame = 24 * pixels;
			var ratio = parseFloat( window.document.forms['EMSCForm']['videocodec'].value );
			datarate = framerate * baseBitsPerFrame * ratio / 1000000;
			}
		else datarate = parseFloat( window.document.forms['EMSCForm']['videocodec'].value );
		
		var videostreams = parseFloat( document.forms['EMSCForm']['numStreams'].value );
		if (isNaN(datarate)) datarate = 0;
		if (isNaN(videostreams)) videostreams = 0;
		datarate *= videostreams;
		}
	
	
	if (window.document.forms['EMSCForm'].audio.checked == true)
		{
		var audiorate = parseFloat( window.document.forms['EMSCForm']['audioFormat'].value ) * parseFloat( document.forms['EMSCForm']['numTracks'].value );
		if (!isNaN(audiorate)) datarate += audiorate;
		}
	
	return datarate;
	}


function EMStorageCalculatorGetUnitDivider()
	{
	var unitName = window.document.forms['EMSCForm']['units'].value;
	if (unitName == 'TiB') return 8796093;	//to convert Mb to TiB
	if (unitName == 'GiB') return 8590;		//to convert Mb to GiB
	if (unitName == 'MiB') return 8.389;		//to convert Mb to MiB
	if (unitName == 'TB') return 8000000;	//to convert Mb to TB
	if (unitName == 'GB') return 8000;		//to convert Mb to GB
	return 8;	//for Mb to MB
	}


function EMStorageCalculatorCalculate()
	{
	var datarate = EMStorageCalculatorFindDatarate();
	
	var hours = parseFloat( window.document.forms['EMSCForm'].hours.value );
	var mins = parseFloat( window.document.forms['EMSCForm'].mins.value );
	if (isNaN(hours)) hours = 0;
	if (isNaN(mins)) mins = 0;
	
	var secs = ( hours*3600 ) + (mins*60);
	var unitDivider = EMStorageCalculatorGetUnitDivider();
	var storage = Math.round( (datarate*secs)/unitDivider );
	if (isNaN(storage) ) window.document.forms['EMSCForm'].storage.value = 0;
	else
		{
		if ((unitDivider == 8796093) && (storage < 10))
			{
			unitDivider = 8590;
			window.document.forms['EMSCForm']['units'].value = 'GiB';
			storage = Math.round( (datarate*secs)/unitDivider );
			}
		
		if ((unitDivider == 8590) && (storage < 10))
			{
			unitDivider == 8.389;
			window.document.forms['EMSCForm']['units'].value = 'MiB';
			storage = Math.round( (datarate*secs)/unitDivider );
			}
		
		if ((unitDivider == 8000000) && (storage < 10))
			{
			unitDivider = 8000;
			window.document.forms['EMSCForm']['units'].value = 'GB';
			storage = Math.round( (datarate*secs)/unitDivider );
			}
		
		if ((unitDivider == 8000) && (storage < 10))
			{
			unitDivider = 8;
			window.document.forms['EMSCForm']['units'].value = 'MB';
			storage = Math.round( (datarate*secs)/unitDivider );
			}
		
		window.document.forms['EMSCForm']['storage'].value = storage;
		window.document.forms['EMSCForm']['bandwidth_megabits'].value = Math.round(datarate * 10) / 10.0;
		window.document.forms['EMSCForm']['bandwidth'].value = Math.round(datarate * 10 / 8.0) / 10.0;
		}
	
	return false;
	}


function EMStorageCalculatorEnableAudio()
	{
	window.document.forms['EMSCForm']['audio'].checked = true;
	}

