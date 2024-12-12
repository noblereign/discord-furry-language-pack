/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

import { Button, Forms, React, Toasts } from "@webpack/common";
//import { runtimeHashMessageKey } from "@utils/intlHash";

import { exportJSON, exportUnknown, exportSpecial, exportKnownSpecial } from "./exporter.js";
import { fundAlts, tailAlts, yiffcordLanguage } from "./language.js";
import { yiffcordLanguageUnhashed } from "./language_legacy.js";
import { showNotification } from "@api/Notifications";

// uwuifier is disabled cause it dont work lol
// also THANK YOU TAY FOR FIGURING OUT HOW VENCORD PLUGINS WORK FOR ME these are so hard i s2g

// wanna get the messages yourself? run this in the command bar:
// Vencord.Webpack.wreq(Vencord.Webpack.findModuleId("Imagine a place"))
const settings = definePluginSettings({
    /* uwuing: {
        description: "“Enhance” chat messages • Run all of your chat messages through an UwUifier for extra flavor. (client-side)",
        type: OptionType.SELECT,
        options: [
            {
                label: "Make my ERPs extra degenerate",
                value: "uwu",
                default: true
            },
            {
                label: "I use this app for talking to my boss",
                value: "godno"
            },
        ] as const,
        onChange(value: string) {
            if (value == "uwu") {
                console.log("Enabing the uwu");
                uwuApplyAll();
            } else if (value == "godno") {
                uwuRevertAll()
            }
        }
    },*/
    tails: {
        description: "Tails replace claws • Replace the Claw Connoisseurs with the Tail Connoisseurs",
        type: OptionType.SELECT,
        options: [
            {
                label: "I like my horoscopes to rhyme",
                value: "sharp",
                default: true
            },
            {
                label: "Claws were never part of the debate",
                value: "fluffy"
            },
        ] as const,
        onChange(value: string) {
            refreshTails();
        }
    },
    funds: {
        description: "Funds replace Knots • Replace Convention Knotting with Convention Funding",
        type: OptionType.SELECT,
        options: [
            {
                label: "Give it to me raw like the good ol' days",
                value: "og",
                default: true
            },
            {
                label: "Keep it clean with capitalism",
                value: "newgen"
            },
        ] as const,
        onChange(value: string) {
            refreshFunds();
        }
    },
    exportJsonDesc: {
        description: "Want to play around with the Discord language files yourself? Gotcha covered.",
        type: OptionType.COMPONENT,
        component: () =>
            <Forms.FormText>
                Want to play around with the Discord language files yourself? Gotcha covered.
            </Forms.FormText>
    },
    exportJson: {
        description: "Exports the default language pack in a JSON format.",
        type: OptionType.COMPONENT,
        component: () =>
            <Button onClick={exportJSON}>
                Export JSON
            </Button>
    },
    exportUnknown: {
        description: "Exports the default language pack in a JSON format. Doesn't export keys that exist in the language pack.",
        type: OptionType.COMPONENT,
        component: () =>
            <Button onClick={exportUnknown}>
                Export unrecognized keys only
            </Button>
    },
    exportSpecial: {
        description: "Exports the default language pack in a JSON format. Only exports keys that have special formatting (e.g. plurals, links, placeholders, etc)",
        type: OptionType.COMPONENT,
        component: () =>
            <Button onClick={exportSpecial}>
                Export formatted keys only
            </Button>
    },
    exportKnownSpecial: {
        description: "Exports the default language pack in a JSON format. Only exports keys that have special formatting (e.g. plurals, links, placeholders, etc) and are known to the language pack",
        type: OptionType.COMPONENT,
        component: () =>
            <Button onClick={exportKnownSpecial}>
                Export known formatted keys only
            </Button>
    }
});

let LocaleManager;

/*
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
    return uwuified;
}

// here's the shit code:
function uwuApplyAll() {
    if (settings.store.uwuing != "uwu") return;
    for (var message of <any>document.getElementsByClassName("messageContent-2t3eCI")) {
        if (!message.dataset.uwu) {
            let iter = document.createNodeIterator(message, NodeFilter.SHOW_TEXT);
            let textnode;
            while (textnode = iter.nextNode()) {
                //console.log(textnode.textContent);
                if (!textnode.parentNode.closest('code')) { //spare codeblocks
                    textnode.uwu = textnode.textContent
                    textnode.textContent = uwuifySentence((textnode.textContent || ""))
                }
            }
            message.dataset.uwu = true //message.textContent
        }
    }
}

function uwuRevertAll() {
    console.log("Reverting the uwu");
    for (var message of <any>document.getElementsByClassName("messageContent-2t3eCI")) {
        if (message.dataset.uwu) {
            let iter = document.createNodeIterator(message, NodeFilter.SHOW_TEXT);
            let textnode;
            while (textnode = iter.nextNode()) {
                if (!textnode.parentNode.closest('code')) { //codeblocks won't have anything lol
                    textnode.textContent = textnode.uwu
                    delete textnode.uwu
                }
            }
            delete message.dataset.uwu
        }
    }
}
*/

function refreshTails() {
    Toasts.show({
        type: Toasts.Type.MESSAGE,
        message: "Please reload for this change to take full effect (CTRL + R)",
        id: Toasts.genId()
    });
}

function refreshFunds() {
    Toasts.show({
        type: Toasts.Type.MESSAGE,
        message: "Please reload for this change to take full effect (CTRL + R)",
        id: Toasts.genId()
    });
}

export default definePlugin({
    name: "Furry Language Pack",
    description: "The default Discord language pack is pleasant, you say? Here. 𝗟𝗲𝘁 𝗺𝗲 𝗳𝗶𝘅 𝘁𝗵𝗮𝘁 𝗳𝗼𝗿 𝘆𝗼𝘂.",
    authors: [
        {
            id: 119682459196588032n,
            name: "Noble",
        },
        {
            id: 744909645973422123n,
            name: "Taylor",
        },
    ],
    settings,
    patches: [
        { // Language pack replacement (Legacy)
            find: "_applyMessagesForLocale(",
            replacement: {
                match: /_applyMessagesForLocale\((\i),(\i)\)\{/,
                replace: "$& $1 = $self.patchLanguage($1, $2);",
            }
        },
        { // Language pack replacement (discord intl)
            find: "getMessageValue(",
            replacement: {
                match: /if\((\S) in this\.messages\[(.*?)\]\)\{let (\S)=this\.messages\[(.*?)\]\[(.*?)\]/,
                replace: "if ($1 in this.messages[$2]){let $3=$self.localizeString($5,this.messages[$4][$5])"
            }
        },
        { // Error handler (to prevent crashing)
            find: "} is not a known option for select value ${",
            replacement: {
                match: /throw new \S\.MissingValueError\((\w+),(\w+)\)/,
                replace: "{ if (e.pushLiteralText) {e.pushLiteralText($self.handleLanguageError($1, $2))} else {$self.handleLanguageError($1, $2)} continue }"
            }
        },
        { // Its too late (Error with notification)
            find: "The intl string context variable",
            replacement: {
                match: /return .\.call\(\w+,'The intl string context variable "'\.concat\((\w+).*?\.concat\((\w+).*?\).*?\}/,
                replace: "$self.throwLanguageError($1, $2); $&"
            }
        },

    ],

    /* flux: {
        MESSAGE_CREATE({ optimistic, type, message, channelId }) {
            if (settings.store.uwuing == "uwu") {
                uwuApplyAll(); //i give up on optimization lol
            }
        },

        CHANNEL_SELECT({ optimistic, type, channelId }) {
            if (settings.store.uwuing == "uwu") {
                uwuApplyAll(); //i give up on optimization lol
            }
        },
    },*/

    start() {
        const moduleID: string | null = Vencord.Webpack.findModuleId("} is not a known option for select value ${");
        if (moduleID === null) {
            Toasts.show({
                type: Toasts.Type.FAILURE,
                message: "Furry Language Pack failed to load. The plugin needs an update. (can't find intl module)",
                id: Toasts.genId()
            });
        }
    },
    stop() {
        Toasts.show({
            type: Toasts.Type.MESSAGE,
            message: "Please reload for this change to take full effect (CTRL + R)",
            id: Toasts.genId()
        });

        // uwuRevertAll()
    },

    autoLocalize(str: string) {
        return str
            .replace(/(discord)/gi, "Yiffcord")
            .replace(/(member)/g, "fur")
            .replace(/(server)/g, "convention")
            .replace(/\b(a[u|w])/g, "paw")
            .replace(/(mod)/g, "mawd")
            .replace(/boost level/g, (settings.store.funds == "newgen") ? "VC tier" : "bottom level")
            .replace(/booster/g, (settings.store.funds == "newgen") ? "investor" : "knotter")
            .replace(/boosti/g, (settings.store.funds == "newgen") ? "fundi" : "knotti")
            .replace(/boost/g, (settings.store.funds == "newgen") ? "fund" : "knot")
            .replace(/text channel/g, "roleplay")
            .replace(/voice channel/g, "room party")
            // uppercase at beginning
            .replace(/(Member)/g, "Fur")
            .replace(/(Server)/g, "Convention")
            .replace(/\b(A[u|w])/g, "Paw")
            .replace(/(Mod)/g, "Mawd")
            .replace(/Boost level/g, (settings.store.funds == "newgen") ? "VC tier" : "Bottom level")
            .replace(/Booster/g, (settings.store.funds == "newgen") ? "Investor" : "Knotter")
            .replace(/Boosti/g, (settings.store.funds == "newgen") ? "Fundi" : "Knotti")
            .replace(/Boost/g, (settings.store.funds == "newgen") ? "Fund" : "Knot")
            .replace(/Text Channel/g, "Roleplay")
            .replace(/Voice Channel/g, "Room Party")
            // uppercase all
            .replace(/(MEMBER)/g, "FUR")
            .replace(/(SERVER)/g, "CONVENTION")
            .replace(/\b(A[U|W])/g, "PAW")
            .replace(/(MOD)/g, "MAWD")
            .replace(/Boost Level/g, (settings.store.funds == "newgen") ? "VC Tier" : "Bottom Level")
            .replace(/BOOSTER/g, (settings.store.funds == "newgen") ? "INVESTOR" : "KNOTTER")
            .replace(/BOOSTI/g, (settings.store.funds == "newgen") ? "FUNDI" : "KNOTTI")
            .replace(/BOOST/g, (settings.store.funds == "newgen") ? "FUND" : "KNOT")
            .replace(/TEXT CHANNEL/g, "ROLEPLAY")
            .replace(/VOICE CHANNEL/g, "ROOM PARTY");
    },

    addCapitalism(str: string) {
        return str
            .replace(/convention knot/g, (settings.store.funds == "newgen") ? "investment" : "convention knot")
            .replace(/Convention knot/g, (settings.store.funds == "newgen") ? "Investment" : "Convention knot")
            .replace(/Convention Knot/g, (settings.store.funds == "newgen") ? "Investment" : "Convention Knot")
            .replace(/knotter/g, (settings.store.funds == "newgen") ? "investor" : "knotter")
            .replace(/Knotter/g, (settings.store.funds == "newgen") ? "Investor" : "Knotter")
            .replace(/KNOTTER/g, (settings.store.funds == "newgen") ? "INVESTOR" : "KNOTTER")
            .replace(/knott/g, (settings.store.funds == "newgen") ? "fund" : "knott")
            .replace(/Knott/g, (settings.store.funds == "newgen") ? "Fund" : "Knott")
            .replace(/KNOTT/g, (settings.store.funds == "newgen") ? "FUND" : "KNOTT")
            .replace(/knot/g, (settings.store.funds == "newgen") ? "fund" : "knot")
            .replace(/Knot/g, (settings.store.funds == "newgen") ? "Fund" : "Knot")
            .replace(/KNOT/g, (settings.store.funds == "newgen") ? "FUND" : "KNOT")
            .replace(/deflat/g, (settings.store.funds == "newgen") ? "devalu" : "deflat")
            .replace(/Deflat/g, (settings.store.funds == "newgen") ? "Devalu" : "Deflat")
            .replace(/DEFLAT/g, (settings.store.funds == "newgen") ? "DEVALU" : "DEFLAT")
            .replace(/bottom level/g, (settings.store.funds == "newgen") ? "VC tier" : "bottom level")
            .replace(/Bottom level/g, (settings.store.funds == "newgen") ? "VC tier" : "Bottom level")
            .replace(/Bottom Level/g, (settings.store.funds == "newgen") ? "VC Tier" : "Bottom Level");
    },

    localizeString(key: string, original: any) {
        if (yiffcordLanguageUnhashed[key]) {
            console.log("[Furry Language Pack] legacy key detected:", key);
            return yiffcordLanguageUnhashed[key];
        }

        if (yiffcordLanguage[key]) {
            if (tailAlts[key] && (settings.store.tails == "fluffy")) { // Replace Claws with Tails when user has it toggled
                return tailAlts[key];
            } else if (fundAlts[key] && (settings.store.funds == "newgen")) { // Replace Knots with Funds when user has it toggled
                return fundAlts[key];
            } else if (settings.store.funds == "newgen") { // auto-localize for boost strings that have no Funds alts
                if (typeof yiffcordLanguage[key] === 'string') {
                    return this.addCapitalism(yiffcordLanguage[key]);
                } else if (typeof yiffcordLanguage[key] === 'object') {
                    if (Array.isArray(yiffcordLanguage[key])) {
                        let modified = structuredClone(yiffcordLanguage[key]);
                        for (const [index, value] of Object.entries(modified)) {
                            if (typeof value === 'string') {
                                modified[index] = this.addCapitalism(value);
                            }
                        }
                        return modified;
                    } else {
                        console.log("[Furry Language Pack] idk what this is");
                        console.log(yiffcordLanguage[key]);
                        return yiffcordLanguage[key];
                    }
                } else {
                    return yiffcordLanguage[key];
                }
            } else {
                return yiffcordLanguage[key];
            }
        } else {
            if (typeof original === 'string') {
                return this.autoLocalize(original);
            } else {
                if (typeof original === 'object') {
                    if (Array.isArray(original)) {
                        for (const [index, value] of Object.entries(original)) {
                            if (typeof value === 'string') {
                                original[index] = this.autoLocalize(value);
                            }
                        }
                    }
                }
                return original;
            }
        }

    },

    patchLanguage(language: Record<string, string>, languageCode: `${string}-${string}`) {
        for (var key in language) {
            if (typeof language[key] !== "string") continue;
            language[key] = this.localizeString(key, language[key]);
        }
        return language;
    },

    throwLanguageError(variable, pattern) {
        showNotification({
            title: "Furry Language Pack caused a crash!",
            body: `The variable "${variable}" was malformed.\nPlease report this to the GitHub, as it is likely an error in the language pack files.`,
            color: "var(--red-360)"
        });
    },

    handleLanguageError(variable, pattern) {
        console.warn(`[Furry Language Pack] The variable "${variable}" was malformed.\nPlease report this to the GitHub, as it is likely an error in the language pack files.`);
        Toasts.show({
            type: Toasts.Type.FAILURE,
            message: `Furry Language Pack prevented a crash. Please report this issue to the GitHub! (Malformed variable: ${variable})`,
            id: Toasts.genId()
        });
        return `!!{${variable}}!!`;
    }
});

