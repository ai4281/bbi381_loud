
timbre.bpm = 100;

//for sending to web audio API
// var api = T("WebAudioAPI:send");
// var context = api.context;

//various arrays for automata use
var oneArray = [0, 0, 1, 0, 0, 0, 1, 1];
var twoArray = [1, 0, 0, 0, 0, 0, 0, 0];
var threeArray = [0, 0, 0, 0, 1, 0, 0, 0];

var ruleset = [1, 0, 1, 0, 0, 0, 0, 1];

var melodyPattern = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0];

//determine which scale is used. 0 = major, 1 = minor, 2 = whole tone
var pitchSet = 2;

//time related things
var d = new Date();
var n = d.getTime();

//env
var envChord = T("perc", {a:1, r:10});
var envMel = T("perc", {a:1, r:50});
var envBass = T("perc", {a:1, r:100});

//synth declaration
var synth = T("OscGen", {wave:"tri", env: envChord, mul:0.3});
var synth2 = T("OscGen", {wave:"tri", env: envMel, mul:1.0, cutoff:1000});

var synth3 = T("OscGen", {wave:"tri", env:envBass, mul:0.6});

//default on/off toggle states for different things
var chordOn = true;
var melodyOn = true;
var bassOn = true;
var percOn = false;
var animateOn = true;

var chord, melody, bass;

setupIntervals();

function setBPM(number)
{
	timbre.bpm = number;

	nullIntervals();
	setupIntervals();
}

function setupIntervals()
{
	//chord L2
	chord = T("interval", {interval:"L8", delay:1000, timeout:"600sec"}, function() {

			//oneArray is the automata array for note choice,
			//twoArray determines whether note velocity is random or really quiet
			newState(oneArray);
			newState(twoArray);

			for (var i = 0; i < oneArray.length; i++)
			{
				if (oneArray[i] == 1)
				{
					var velocity;

					if (twoArray[i] = 1)
					{
						velocity = Math.random() * 30 + 10;
					}

					if (twoArray[i] == 0)
					{
						velocity = 0;
					}

					if (chordOn)
					{
						synth.noteOn(150 + pitchSetFunc(i, pitchSet), velocity);

					}
				}
			}

		}
	).set({buddies:synth}).start();


	var melodyIteration = 0;

	//melody L8
	melody = T("interval", {interval:"L8", delay:100}, function() {


		//threeArray determines whehter the melodyPattern index gets played or not
		//all these arrays follow the automata algorithm and get changed
		newState(threeArray);

		if (melodyIteration > melodyPattern.length)
		{
			melodyIteration = 0;

			newState(melodyPattern);
		}

		melodyIteration++;

		for (var i = 0; i < threeArray.length; i++)
		{

			if (threeArray[i] == 1)
			{
				if (melodyPattern[melodyIteration] == 1)
				{
					if (melodyOn)
					{
						synth2.noteOn(74 + pitchSetFunc(i, pitchSet), 5 + Math.random() * 20);
						return;
					}

					
					
				}
				
			}
		}
	}).on("ended", function() {
	    this.stop();
	}).set({buddies:synth2}).start();


	//bass
	bass = T("interval", {interval:"L8", timeout:"600sec"}, function() {

		//pitch is just random note from the set pitch class
		//velocity is random as well

		var loudness = 0;

		for (var i = 0; i < twoArray.length; i++)
		{
			loudness += twoArray[i];
		}

		if (loudness > 8 - (x/100) )
		{
			loudness = 120;
		}

		else
		{
			loudness = 0;
			synth3.allNoteOff();
		}

		if (bassOn)
		{
		 	//synth.noteOn(pitchSetFunc(Math.floor(Math.random() * 12), pitchSet) + 38, Math.random() * 90);
			//synth3.noteOn( Math.floor(Math.random() * 2) * 12 + 30 , loudness);
			synth3.noteOn( twoArray[4] * 12 + 25 , loudness);

		}
	}).on("ended", function() {
	    this.stop();
	}).set({buddies:synth3}).start();

}

function nullIntervals()
{
	chord.stop();
	melody.stop();
	bass.stop();

	chord = null;
	melody = null;
	bass = null;

}

//send timbre to webaudio API
// api.append(synth).send(context.destination);
// api.append(synth2).send(context.destination);
// api.append(synth3).send(context.destination);

// var rec;

// function initRecord()
// {
// 	//var scriptNode = context.listener.createScriptProcessor(4096, 1, 1);
// 	rec = new Recorder( context );
// }

// function startRecording()
// {
// 	rec.record();
// }

// function stopRecording()
// {
// 	rec.stop();

// 	createDownloadLink();
// }

// function createDownloadLink(blob) {

// 	var url = URL.createObjectURL(blob);
// 	var li = document.createElement('li');
// 	var hf = document.createElement('a');

// 	hf.href = url;
// 	hf.download = new Date().toISOString() + '.wav';
// 	hf.innerHTML = hf.download;
// 	li.appendChild(hf);

// 	document.getElementById('downloadLink').appendChild(li);
// 	document.getElementById('downloadLink').appendChild(hf);

// 	console.log(hf);

// }




//has all the possiblities for 3 states
//returns ruleset value
function rules(a, b, c) {

	if      (a == 1 && b == 1 && c == 1) return ruleset[0];
    else if (a == 1 && b == 1 && c == 0) return ruleset[1];
    else if (a == 1 && b == 0 && c == 1) return ruleset[2];
    else if (a == 1 && b == 0 && c == 0) return ruleset[3];
    else if (a == 0 && b == 1 && c == 1) return ruleset[4];
    else if (a == 0 && b == 1 && c == 0) return ruleset[5];
    else if (a == 0 && b == 0 && c == 1) return ruleset[6];
    else if (a == 0 && b == 0 && c == 0) return ruleset[7];
    
    return 0;
}

//any array can be plugged in here and it will return new values for it using the ruleset
function newState(arrayVar) {

	for (var i = 0; i < arrayVar.length; i++)
	{
		if (i == 0 || i == arrayVar.length - 1)
		{
			arrayVar[i] = Math.floor(Math.random() * 2);
		}

		else
		{
			arrayVar[i] = rules(arrayVar[i-1], arrayVar[i], arrayVar[i+1]);
		}
	}

}

//shuffles the ruleset when button pressed
function shuffleRuleset()
{
	for (var i = 0; i < ruleset.length; i++)
	{
		ruleset[i] = Math.floor( Math.random() * 2 );
	}
}

//returns appropriate pitch value for noteIndex in a scale
//has major, minor, and whole tone scales for now
function pitchSetFunc(noteIndex, pitchSetNum)
{
	//maj scale
	if (pitchSetNum == 0)
	{
		switch(noteIndex)
		{
			case 0: return 0;

			case 1: return 2;

			case 2: return 4;

			case 3: return 5;

			case 4: return 7;

			case 5: return 10;

			case 6: return 11;

			case 7: return 12;
		}
	}

	//min scale
	else if (pitchSetNum == 1)
	{
		switch(noteIndex)
		{
			case 0: return 0;

			case 1: return 2;

			case 2: return 3;

			case 3: return 5;

			case 4: return 7;

			case 5: return 8;

			case 6: return 11;

			case 7: return 12;
		}
	}

	//whole tone scale
	else if (pitchSetNum == 2)
	{
		switch(noteIndex)
		{
			case 0: return 0;

			case 1: return 2;

			case 2: return 4;

			case 3: return 6;

			case 4: return 8;

			case 5: return 10;

			case 6: return 12;

			case 7: return 14;
		}
	}

	return 10;


}


