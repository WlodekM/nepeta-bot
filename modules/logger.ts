// deno-lint-ignore-file no-inner-declarations no-var no-redeclare
import { Events, type Client } from "discord.js";
import fs from 'node:fs'

/**
 * Port of strftime(). Compatibility notes:
 *
 * %c - formatted string is slightly different
 * ~~%D - not implemented (use "%m/%d/%y" or "%d/%m/%y")~~
 * ~~%e - space is not added~~
 * %E - not implemented
 * ~~%h - not implemented (use "%b")~~
 * %k - space is not added
 * %n - not implemented (use "\n")
 * %O - not implemented
 * %r - not implemented (use "%I:%M:%S %p")
 * %R - not implemented (use "%H:%M")
 * %t - not implemented (use "\t")
 * %T - not implemented (use "%H:%M:%S")
 * %U - not implemented
 * %W - not implemented
 * %+ - not implemented
 * %% - not implemented (use "%")
 *
 * strftime() reference:
 * http://man7.org/linux/man-pages/man3/strftime.3.html
 *
 * Day of year (%j) code based on Joe Orost"s answer:
 * http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
 *
 * Week number (%V) code based on Taco van den Broek"s prototype:
 * http://techblog.procurios.nl/k/news/view/33796/14863/calculate-iso-8601-week-and-year-in-javascript.html
 * 
 * modified by berry to have some more functionality (see: the ~~crossed out~~ compatibility notes)
 * 
 * @param {string} sFormat - the date format (see http://man7.org/linux/man-pages/man3/strftime.3.html)
 * @param {Date} [date] - the date (if not provided will use new Date())
 * @param {boolean} [utc] - use the UTC functions instead of the local ones
 */
function strftime(sFormat: string, date?: Date, utc?: boolean) {
	if (!(date instanceof Date)) date = new Date();
	if (isNaN(+date))
		throw "Invalid date";
	if (utc)
		var	nDay = date.getUTCDay(),
			nDate = date.getUTCDate(),
			nMonth = date.getUTCMonth(),
			nYear = date.getUTCFullYear(),
			nHour = date.getUTCHours();
	else
		var	nDay = date.getDay(),
			nDate = date.getDate(),
			nMonth = date.getMonth(),
			nYear = date.getFullYear(),
			nHour = date.getHours();
	
	var	aDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		aMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
		supportsISO = typeof date.toISOString != "undefined",
		isLeapYear = function () {
			return (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
		},
		getThursday = function () {
			var target = new Date(date);
			target.setDate(nDate - ((nDay + 6) % 7) + 3);
			return target;
		},
		zeroPad = function (nNum: number, nPad: number) {
			return ("" + (Math.pow(10, nPad) + nNum)).slice(1);
		};
	return sFormat.replace(/%[a-z]/gi, function (sMatch: string) {
		return ({
			"%a": aDays[nDay].slice(0, 3),
			"%A": aDays[nDay],
			"%b": aMonths[nMonth].slice(0, 3),
			"%h": aMonths[nMonth].slice(0, 3),
			"%B": aMonths[nMonth],
			"%c": date.toUTCString(),
			"%C": Math.floor(nYear / 100),
			"%d": zeroPad(nDate, 2),
			"%D": zeroPad(nMonth + 1, 2) + "/" + zeroPad(nDate, 2) + "/" + ("" + nYear).slice(2),
			"%e": (function() {
				var date = zeroPad(nDate, 2);
				if (date[0] == "0")
					return " " + date.slice(1);
				return date;
			})(),
			"%F": nYear.toString()+'-'+zeroPad(nMonth + 1, 2)+'-'+zeroPad(nDate, 2),
			"%G": getThursday().getFullYear(),
			"%g": ("" + getThursday().getFullYear()).slice(2),
			"%H": zeroPad(nHour, 2),
			"%I": zeroPad((nHour + 11) % 12 + 1, 2),
			"%j": zeroPad(aDayCount[nMonth] + nDate + ((nMonth > 1 && isLeapYear()) ? 1 : 0), 3),
			"%k": "" + nHour,
			"%l": (nHour + 11) % 12 + 1,
			"%m": zeroPad(nMonth + 1, 2),
			"%M": zeroPad(date.getMinutes(), 2),
			"%p": (nHour < 12) ? "AM" : "PM",
			"%P": (nHour < 12) ? "am" : "pm",
			"%s": Math.round(date.getTime() / 1000),
			"%S": zeroPad(date.getSeconds(), 2),
			"%u": nDay || 7,
			"%V": (function () {
				var	target = getThursday(),
					n1stThu = target.valueOf();
				target.setMonth(0, 1);
				var nJan1 = target.getDay();
				if (nJan1 !== 4) target.setMonth(0, 1 + ((4 - nJan1) + 7) % 7);
				return zeroPad(1 + Math.ceil((n1stThu - +target) / 604800000), 2);
			})(),
			"%w": "" + nDay,
			"%x": date.toLocaleDateString(),
			"%X": date.toLocaleTimeString(),
			"%y": ("" + nYear).slice(2),
			"%Y": nYear,
			"%z": date.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
			"%Z": date.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
			"%%": "%"
		} as Record<string,string|number>)[sMatch].toString() || sMatch;
	});
}

export default function mount(client: Client) {
	client.on(Events.MessageCreate, message => {
		const dir = `logs/${message.guildId}/${message.channelId}/`;
		const filename = `${strftime('%Y-%m-%d')}.txt`;
		fs.mkdirSync(dir, {
			recursive: true
		});
		if (!fs.existsSync(`${dir}/${filename}`))
			fs.writeFileSync(`${dir}/${filename}`, '');
		fs.appendFileSync(`${dir}/${filename}`, `(${message.author.id})${message.author.username}: ${message.content}\n`);
	})
}