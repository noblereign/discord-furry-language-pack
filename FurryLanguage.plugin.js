/**
 * @name FurryLanguagePack
 * @author NobleFurLyfe
 * @description The default Discord language pack is pleasant, you say? Here. **Let me fix that for you.** *Fair warning, this language pack is extremely stereotypical. It can get a little depraved, too.*
 * @version 1.1.2-beta
 * @authorLink https://federated.glacier.dog/web/@frostbite
 * @website https://github.com/noblereign
 */

//META{"name":"Furry Language Pack"}*//



const config = {
	"info": {
		"name": "FurryLanguagePack",
		"authors": [{
			"name": "NobleFurLyfe",
			"github_username": "noblereign",
            "twitter_username": "NobleFurLyfe",
		},
        {
			"name": "Taylor Robinson",
			"github_username": "TayIorRobinson",
            "twitter_username": "TayIorRobinson",
		}],
		"version": "1.1.2-beta",
		"description": "The default Discord language pack is pleasant, you say? Here. **Let me fix that for you.** *Fair warning, this language pack is extremely stereotypical, somewhat depraved, and also contains some swearing.*",
		"github_raw": "https://raw.githubusercontent.com/noblereign/discord-furry-language-pack/master/FurryLanguage.plugin.js",
	},
	"changelog": [
		{
			"title": "I'm sorry for being so lacking in skill",
			"type": "fixed",
			"items": [
                "Fixed the 'your server is losing a level' screen crashing clients.)"
			]
		},
        {
			"title": "Made with 🐺💙",
			"type": "love",
			"items": [
                "Initial concept by Taylor, and brought back from the dead by Noble.",
			]
		},
	],
    "defaultConfig": [
        {
            type: "radio",
            id: "uwuing",
            name: '“Enhance” chat messages',
            note: 'Run all of your chat messages through an UwUifier for extra flavor. (client-side)',
            value: "uwu",
            options: [
                {name: "Make my ERPs extra degenerate", value: "uwu"},
                {name: "I use this app for talking to my boss", value: "godno"}
            ]
        },
        {
            type: "radio",
            id: "tails",
            name: 'Tails replace claws',
            note: 'Replace the Claw Connoisseurs with the Tail Connoisseurs',
            value: "sharp",
            options: [
                {name: "I like my horoscopes to rhyme", value: "sharp"},
                {name: "Claws were never part of the debate", value: "fluffy"}
            ]
        },
    ]
}

/* ----Useful links----
 * 
 * BetterDiscord BdApi documentation:
 *   https://github.com/BetterDiscord/BetterDiscord/wiki/Creating-Plugins
 * 
 * Zere's Plugin Library documentation:
 * 	 https://rauenzi.github.io/BDPluginLibrary/docs/
*/

//thank u to bettermessagelinks for helping me figure out how the hell to use zere plugin library 😭

//SORRY ABOUT THIS HUGE ASS STRING I WAS TOO SCARED TO UPLOAD THIS TO GITHUB
//DISABLE WRAPPING FOR A BETTER EXPERIENCE

//UPDATE: okay im gonna try to upload this to github but im actually just too lazy to figure out how to do the error handling and stuff rn maybe i'll do it later. for now you get huge ass string


const tailAlts = {"HYPESQUAD_QUIZ_BODY_HOUSE_3":"I mean, you don't really need a charged backstory to explain why you like tails, do you?? They're fluffy. They're cute! They're lovable, huggable, and really, really snugglable. Like, you can just like 'em to like 'em. So, welcome, my friend. You're now part of the 𝗧𝗮𝗶𝗹 𝗖𝗼𝗻𝗻𝗼𝗶𝘀𝘀𝗲𝘂𝗿𝘀.","HYPESQUAD_DESCRIPTION_HOUSE_3":"Lovable, huggable, and really, really snugglable.","HYPESQUAD_HOUSE_3":"Tail"}


module.exports = !global.ZeresPluginLibrary ? class {
	constructor() { this._config = config; }
	getName() { return config.info.name; }
	getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
	getDescription() { return config.info.description; }
	getVersion() { return config.info.version; }
	load() {
		BdApi.showConfirmationModal("Libwawy Missing TwT", `U-Uhm,, the libway pwugin fow da **Fuwwy Wanguage Pack** isn't thewe! P-Pwease cwick Download Now to install it..! @w@`, {
			confirmText: "Download Now",
			cancelText: "Holy shit, no",
			onConfirm: () => {
				require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
					if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
					await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
				});
			}
		});
	}
	start() { }
	stop() { }
} : (([Plugin, Library]) => {
    const { WebpackModules, Patcher, Settings, DiscordModules, React, Webpack:{Filters:{byStrings}} } = { ...BdApi, ...Library };
    const LocaleManager = DiscordModules.LocaleManager //use .provider to get
    const StringCreation = DiscordModules.StringFormats
    const { SettingPanel, Switch, Slider, RadioGroup, Textbox, SettingGroup } = Settings;
    const Anchor = WebpackModules.getModule(m => m?.toString().includes('noreferrer noopener') && m?.toString().includes('focusProps'));
    const Dispatcher = Library.DiscordModules.Dispatcher
    const MessageContent = WebpackModules.getModule(m => m.type?.displayName === "MessageContent");
    let settings = {};
    /*

    Authors Note:

    Me figuring out how the Locale system in Discord works over Telegram.
    Noble, [1/24/2023 2:54 AM]
    there's a big list containing all of the like 13k localizations
    but
    discord does the 'parsing' on the fly
    so as you get into more situations that show different strings it gets added to the 'parsed' table
    so like
    by default it'll have the first few that was needed to load discord yeah
    but then like
    if you, say, send a friend a Nitro gift
    the strings needed for the gift (you gifted someone nitro, take it for yourself, blah blah) get parsed and put into the parsed table
    okay so now that i know how that works
    the next step is
    can a plugin actually modify that

    The answer to that was: Yes! Well, it's better to just modify the big table with the normal strings, and then clear the parsed table. But it's possible, and this is proof!
    Now the Fuwwy Discord Language Pack can live on forever, as a proper plugin instead of a buggy Fiddler interception.
    2020 Tay and Noble would be proud. 2023 Tay and Noble? Mmmm... debatable.

    BIG LIST OF STRINGS: 
    actually used 'strings' seem to be in _context.messages
    english fallbacks might be _context.defaultMessages
    parsed strings are in _parsedMessages, can be 'gotten' with _getParsedMessages function

    need to have:
    - big furrified language pack (set _context.messages)
    - on plugin load, set _context.messages to furry, change all currently parsed to furry (we didn't end up doing the parsed bit)
    - on plugin unload, set _context.messages back to english, same with currently parsed, we can do this with the fallback table

    "UWUIFIER_ENABLE": 'Make my ERPs extra degenerate',
    "UWUIFIER_DISABLE": 'I use this app for talking to my boss',
    "UWUIFIER_CREDITS": 'regrettably made by theLMGN and Noble',

    */

    function getTextNodesIn(node, includeWhitespaceNodes) {
        var textNodes = [], whitespace = /^\s*$/;
    
        function getTextNodes(node) {
            if (node.nodeType == 3) {
                if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                    textNodes.push(node);
                }
            } else {
                for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }
    
        getTextNodes(node);
        return textNodes;
    }

    var uwu = {}
    const faces = [`(・\`ω´・)`, `;;w;;`, `owo`, `UwU`, `>w<`, `^w^`, `ÚwÚ`, `:3`, `x3`];
    const actions = [
        `*blushes*`,
        `*whispers to self*`,
        `*sweats*`,
        `*sees buldge*`,
        `*runs away*`,
        `*huggles tightly*`,
        `*boops your nose*`,
        `*starts twerking*`,
    ];
    const exclimations = [`?!!`, `?!?1`, `!!11`, `?!?!`, `!?`];
    function getElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function uwuifyWord(word) {
        word = word.replace(/(?:r|l)/g, `w`);
        word = word.replace(/(?:R|L)/g, `W`);
        word = word.replace(/n([aeiou])/g, `ny$1`);
        word = word.replace(/N([aeiou])/g, `Ny$1`);
        word = word.replace(/N([AEIOU])/g, `Ny$1`);
        word = word.replace(/ove/g, `uv`);
        return word;
    }

    // Get a random uwu face
    function uwuFace() {
        return faces[Math.floor(Math.random() * faces.length)];
    }

    function uwuifySentence(sentence) {
        let uwuified = sentence;
        if (sentence.trim().length) {
            // Replace normal question marks and exclimations with more 'expressive' characters
            sentence = sentence.replace(new RegExp('[?!]+$'), getElement(exclimations));
            // Split the sentence into words
            const words = sentence.split(` `);
            const pattern = new RegExp(/(?:https?|ftp):\/\/[\n\S]+/g);
            uwuified = ``;
            words.forEach((normalWord) => {
                const isUrl = pattern.test(normalWord);
                const isUwuified = normalWord !== uwuifyWord(normalWord);
                let uwuifiedWord = isUrl ? normalWord : uwuifyWord(normalWord);
                let isWhitespace = !normalWord.trim().length
                const random = Math.random();
                // 5% chance of getting a random face
                if (random <= 0.05) {
                    uwuified += ` ${getElement(faces)}`;
                    // 5% chance of a getting a random action
                }
                else if (random <= 0.10) {
                    uwuified += ` ${getElement(actions)}`;
                    // 10% chance of stutter if the word hasn't been uwuified before for readability
                }
                else if (random <= 0.20 && !isUwuified && !isUrl && !isWhitespace) {
                    const letter = normalWord[0];
                    const stutter = getRandomInt(0, 2);
                    for (let i = 0; i < stutter; i++) {
                        uwuifiedWord = `${letter}-${uwuifiedWord}`;
                    }
                }
                uwuified += ` ${uwuifiedWord}`;
            });
        }
        /*console.log(uwuified);*/
        return uwuified;
    }

    // here's the shit code:
    function uwuApplyAll() {
        if (settings.uwuing != "uwu") return;
       // console.log("uwuifying all...");
        for (var message of document.getElementsByClassName("messageContent-2t3eCI")) {
            if (!message.dataset.uwu) {
                /*console.log("no uwu found, attempting apply")*/
               
               /* var textNodes = getTextNodesIn(message)
                textNodes.forEach((node) => {
                    console.log(node.textContent);
                });*/
                iter = document.createNodeIterator(message, NodeFilter.SHOW_TEXT);
                let textnode;

                // print all text nodes
                while (textnode = iter.nextNode()) {
                    //console.log(textnode.textContent);
                    if (!textnode.parentNode.closest('code')) { //spare codeblocks
                        textnode.uwu = textnode.textContent
                        textnode.textContent = uwuifySentence((textnode.textContent || ""))
                    }
                }

                message.dataset.uwu = true //message.textContent 
               // message.textContent = uwuifySentence((message.textContent || ""))
            }
        }
    }

    function uwuRevertAll() {
        console.log("Reverting the uwu");
        for (var message of document.getElementsByClassName("messageContent-2t3eCI")) {
            if (message.dataset.uwu) {
                iter = document.createNodeIterator(message, NodeFilter.SHOW_TEXT);
                let textnode;

                // print all text nodes
                while (textnode = iter.nextNode()) {
                    //console.log(textnode.textContent);
                    if (!textnode.parentNode.closest('code')) { //codeblocks won't have anything lol
                        textnode.textContent = textnode.uwu
                        delete textnode.uwu
                    }
                }

                delete message.dataset.uwu
            }
        }
    }


    function refreshTails() {
        console.log("Refreshing claws and tails");
        for (const [key, value] of Object.entries(yiffcordLanguage)) {
            if (LocaleManager._provider._context.messages[key]) {
                if (tailAlts[key]) {
                    if (settings.tails == "fluffy") {
                        LocaleManager._provider._context.messages[key] = Library.Utilities.formatString(tailAlts[key]);
                    } else {
                        LocaleManager._provider._context.messages[key] = Library.Utilities.formatString(value);
                    }
                }
            }
        }
        LocaleManager._provider.refresh()
    }
   /* Object.defineProperty(window, 'uwu', { 
        set: function(x) { 
            if (x) {
                // enable uwuing
                console.log("Enabing the uwu")
                window.uwu.uwuing = true;
                window.uwu.apply()
            } else {
                // disable uwuing
                console.log("Disabling the uwu")
                window.uwu.uwuing = false
                
                localStorage.setItem("uwuing",false)
                window.uwu.apply()
                console.log("Reverting the uwu")
                for (var message of document.querySelectorAll(".messageContent-2t3eCI")) {
                    if (message.dataset.uwu) {
                        message.textContent = message.dataset.uwu
                        delete message.dataset.uwu
                    }
                }
            }
        },
        get: function(x) { return uwu}
    });
    ls()


const MessageContent = ZLibrary.WebpackModules.getModule(m => m.type?.displayName === "MessageContent");
ZLibrary.Patcher.after("e", MessageContent, "type", (_, [props], ret) => {
  props.message.content = "e"
})


    window.uwu.uwuing = (localStorage.getItem("uwuing") || "true") == "true"*/

    

    
    /*.then(
        function(value) {myDisplayer(value);},
        function(error) {myDisplayer(error);}
      );*/
    //StringCreation.toString(value).format(value);
    return class FurryLanguagePack extends Plugin {

        onMessage({message, channelId}) {
            //const channel = ChannelStore.getChannel(message.guild_id, channelId);
            //console.log("message created");
            if (settings.uwuing == "uwu") {
                uwuApplyAll(); //i give up on optimization lol
               /* console.log("uwu is on");
                console.log(!message.dataset.uwu);
                if (!message.dataset.uwu) {
                    message.dataset.uwu = message.content 
                    message.content = uwuifySentence(message.content || "")
                }*/

            }
        }

        onChannelSwitch() {
            if (settings.uwuing == "uwu") {
                uwuApplyAll();
            }
        }

        onStart() {
            //console.log(DiscordModules.LocaleManager.getAvailableLocales())
            settings = this.settings
            for (const [key, value] of Object.entries(yiffcordLanguage)) {
                if (LocaleManager._provider._context.messages[key]) {
                    if (tailAlts[key] && (settings.tails == "fluffy")) { // Replace Claws with Tails when user has it toggled
                        LocaleManager._provider._context.messages[key] = Library.Utilities.formatString(tailAlts[key]);
                    } else {
                        LocaleManager._provider._context.messages[key] = Library.Utilities.formatString(value);
                    }
                }
            }
            LocaleManager._provider.refresh()

            /*Patcher.after("e", MessageContent, "type", (_, [props], ret) => {
                if (settings.uwuing == "uwu") {
                    if (!props.message.dataset.uwu) {
                        props.message.dataset.uwu = props.message.content 
                        props.message.content = uwuifySentence(props.message.content || "")
                    }
                }
            });*/

            if (settings.uwuing == "uwu") {
              uwuApplyAll();
            }
            console.log("began with",settings.uwuing)
            Dispatcher.subscribe("MESSAGE_CREATE", this.onMessage);
            Dispatcher.subscribe("CHANNEL_SELECT", this.onChannelSwitch);
        }

        onStop() {
            for (const [key, value] of Object.entries(LocaleManager._provider._context.defaultMessages)) {
                if (LocaleManager._provider._context.messages[key]) {
                    LocaleManager._provider._context.messages[key] = Library.Utilities.formatString(value);
                }
               /* if (LocaleManager._provider._parsedMessages[key]) {
                    LocaleManager._provider._parsedMessages[key] = Library.Utilities.formatString(value);
                }*/
            }
            LocaleManager._provider.refresh()
            Dispatcher.unsubscribe("MESSAGE_CREATE", this.onMessage);
            Dispatcher.unsubscribe("CHANNEL_SELECT", this.onChannelSwitch);

            
            uwuRevertAll()
           /* for (var variableKey in LocaleManager._provider._parsedMessages){
                if (LocaleManager._provider._parsedMessages.hasOwnProperty(variableKey)){
                    delete LocaleManager._provider._parsedMessages[variableKey];
                }
            }*/
            Patcher.unpatchAll();
        }

        getSettingsPanelId() {
            return `${config.info.name}-settings`;
        }

        getSettingsPanel() { // code taken from ChannelsPreview plugin cause i dont know how tf to do settings panels
            const panel = this.buildSettingsPanel();

            const element = panel.getElement();
            element.id = this.getSettingsPanelId();
            element.prepend(new Settings.SettingField(null, React.createElement(DiscordModules.TextElement, {
                children: [
                    "Still can't believe you actually installed this. But hey, while you're here, why not ",
                    React.createElement(Anchor, {
                        children: "check out Tay's Mastodon page?",
                        href: 'https://tech.lgbt/@tay'
                    }),
                    '.'
                ],
                className: `${DiscordModules.TextElement.Colors.STANDARD} ${DiscordModules.TextElement.Sizes.SIZE_14}`
            }), () => {}, document.createElement('div')).inputWrapper);

            panel.addListener((setting, value) => {
                //console.log("changed", setting, value);
                if (setting == "uwuing") {
                    if (value == "uwu") {
                        console.log("Enabing the uwu");
                        uwuApplyAll();
                    } else if (value == "godno") {
                        uwuRevertAll()
                    }
                } else if (setting == "tails") {
                    refreshTails()
                }
            })

            return element;
        }
    };
})(global.ZeresPluginLibrary.buildPlugin(config));