/**
 * @name NudgeUsers
 * @author Vukky
 * @description Nudge users, like in the old days.
 * @version 1.0.1
 * @invite HfBAtQ2afz
 * @authorId 708333380525228082
 * @authorLink https://twitter.com/vukkied
 * @website https://github.com/Vukkyy/Discord-Mods
 * @source https://github.com/Vukkyy/Discord-Mods/blob/main/NudgeUsers/NudgeUsers.plugin.js
 */

class NudgeUsers {

    getName() {return "NudgeUsers";}
    getAuthor() {return "Vukky";}
    getDescription() {return "Nudge users, like in the old days.";}
    getVersion() {return "1.0.1";}

    start() {
        if (!global.ZeresPluginLibrary) {
            return BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.getName()} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        this.nudgeSfx = new Audio('https://www.dropbox.com/s/1i56221g56uqqfm/nudge.mp3?dl=1');
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://github.com/Vukkyy/Discord-Mods/blob/main/NudgeUsers/NudgeUsers.plugin.js");
        BdApi.injectCSS("NudgeUsers--css",`
        .getNudged {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        `);
        let dispatchModule = BdApi.findModuleByProps('dirtyDispatch');
        BdApi.Patcher.after(this.getName(), dispatchModule, 'dispatch', this.handleMessage.bind(this));
    }

    // i am fucking lazy so thanks KeywordTracker lol
    handleMessage(_, args) {
        try {
            let event = args[0];
            if (event.type !== 'MESSAGE_CREATE') return;
            // get message data
            let { message } = event;
            if (!message.content) return;
            if (message.guild_id != undefined) return;
            if (message.content == "nudge" || message.content == "_nudge_") {
                this.nudgeSfx.play();
                document.querySelector("#app-mount").classList.add("getNudged");
                setTimeout(() => {
                    document.querySelector("#app-mount").classList.remove("getNudged");
                }, 600);
            }
        } catch (e) {
            console.error(e);
        }
    }

    stop() {
        
	}
}