/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2024 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Toasts } from "@webpack/common";
import { fundAlts, tailAlts, yiffcordLanguage } from "./language.js";

// 99% of this is coppied from src\utils\settingsSync.ts

// that's crazy bruh -🐺

// a lot of this taken from the gifCollections plugin because i don't know much typescript/vencord plugin dev

async function handleExport(ignoreKnown, ignoreStrings) {
    let languageJSON = null;
    try {
        let moduleID: string | null = Vencord.Webpack.findModuleId("Imagine a place");
        if (moduleID !== null) {
            languageJSON = Vencord.Webpack.wreq(parseInt(moduleID)).default;

            if (languageJSON !== null) {

                let moddedJSON = structuredClone(languageJSON);

                if (ignoreKnown === "opposite") {
                    for (const [key, _] of Object.entries(moddedJSON)) {
                        if (!(yiffcordLanguage[key] || fundAlts[key] || tailAlts[key])) {
                            delete moddedJSON[key];
                        }
                    }
                } else if (ignoreKnown) {
                    for (const [key, _] of Object.entries(moddedJSON)) {
                        if (yiffcordLanguage[key] || fundAlts[key] || tailAlts[key]) {
                            delete moddedJSON[key];
                        }
                    }
                }

                if (ignoreStrings) {
                    for (const [key, value] of Object.entries(moddedJSON)) {
                        if (typeof value === 'string') {
                            delete moddedJSON[key];
                        }
                    }
                }

                const filename = "discord-language-export.json";
                const exportData = JSON.stringify(moddedJSON, null, 4);
                const data = new TextEncoder().encode(exportData);

                if (IS_WEB) {
                    const file = new File([data], filename, { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(file);
                    a.download = filename;

                    document.body.appendChild(a);
                    a.click();
                    setImmediate(() => {
                        URL.revokeObjectURL(a.href);
                        document.body.removeChild(a);
                    });
                } else {
                    DiscordNative.fileManager.saveWithDialog(data, filename);
                }
            } else {
                Toasts.show({
                    type: Toasts.Type.FAILURE,
                    message: `Couldn't get JSON. The plugin may need updating.`,
                    id: Toasts.genId()
                });
            }
        } else {
            Toasts.show({
                type: Toasts.Type.FAILURE,
                message: `Couldn't find LocaleManager. The plugin may need updating.`,
                id: Toasts.genId()
            });
        }
    } catch (error) {
        Toasts.show({
            type: Toasts.Type.FAILURE,
            message: `Failed to export language: ${String(error)}`,
            id: Toasts.genId()
        });
    }
}

export async function exportJSON() {
    handleExport(false, false);
}

export async function exportUnknown() {
    handleExport(true, false);
}

export async function exportSpecial() {
    handleExport(false, true);
}

export async function exportKnownSpecial() {
    handleExport("opposite", true);
}
