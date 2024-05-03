/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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
// 99% of this is coppied from src\utils\settingsSync.ts

// that's crazy bruh -🐺

// a lot of this taken from the gifCollections plugin because i don't know much typescript/vencord plugin dev

export async function exportJSON() {
    let languageJSON = null
    try {
        let moduleID : string | null = Vencord.Webpack.findModuleId("Imagine a place")
        if (moduleID !== null) {
            languageJSON = Vencord.Webpack.wreq(parseInt(moduleID))

            if (languageJSON !== null ) {
                const filename = "default-discord-language.json";
                const exportData = JSON.stringify(languageJSON, null, 4);
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
