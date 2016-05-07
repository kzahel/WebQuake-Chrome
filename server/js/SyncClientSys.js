Sys = {};

Sys.Quit = function()
{
	if (Sys.frame != null)
		clearInterval(Sys.frame);
	var i;
	for (i = 0; i < Sys.events.length; ++i)
		window[Sys.events[i]] = null;
	Host.Shutdown();
	throw new Error;
};

Sys.Print = function(text)
{
    if (window.console != null)
	if (stdoutwrite) stdoutwrite(text)
	console.log(text);
};

Sys.Error = function(text)
{
	console.log(text)
	if (stdoutwrite) stdoutwrite(text)
	if (Host.initialized === true)
		Host.Shutdown();
	throw new Error(text);
};

Sys.FloatTime = function()
{
	return Date.now() * 0.001 - Sys.oldtime;
};

Sys.cmd = ''
Sys.ConsoleInput = function()
{
	var text = Sys.cmd;
	if (text.length === 0)
		return;
	Sys.cmd = '';
	return text;
};

Sys.main = function()
{
	if (Number.isNaN != null)
		Q.isNaN = Number.isNaN;
	else
		Q.isNaN = isNaN;

	var i;

	var cmdline = decodeURIComponent(document.location.search);
	var location = document.location;
	var argv = [location.href.substring(0, location.href.length - location.search.length)];
	if (cmdline.charCodeAt(0) === 63)
	{
		var text = '';
		var quotes = false;
		var c;
		for (i = 1; i < cmdline.length; ++i)
		{
			c = cmdline.charCodeAt(i);
			if ((c < 32) || (c > 127))
				continue;
			if (c === 34)
			{
				quotes = !quotes;
				continue;
			}
			if ((quotes === false) && (c === 32))
			{
				if (text.length === 0)
					continue;
				argv[argv.length] = text;
				text = '';
				continue;
			}
			text += cmdline.charAt(i);
		}
		if (text.length !== 0)
			argv[argv.length] = text;
	}
	COM.InitArgv(argv);

	Sys.oldtime = Date.now() * 0.001;

	Sys.Print('Host.Init\n');
	Host.Init();

	setTimeout( Host.Frame, 1 )
	//Sys.frame = setInterval(Host.Frame, 1000.0 / Sys.framerate);
};


Sys.StdinOnData = function(data)
{
	Sys.cmd += Q.memstr(data);
};
