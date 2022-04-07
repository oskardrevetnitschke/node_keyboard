const WinAudio = require('./win-audio');
const SendInput = require('./sendinput');
const NodeAudio = require('./node-audio-volume-mixer');

const vAudio = require('win-audio').speaker;
const { NodeAudioVolumeMixer } = require("node-audio-volume-mixer");

const vWinAudio = new WinAudio();
const vSendInput = new SendInput();
const vNodeAudio = new NodeAudio();

const oAppBlacklist = require('../public/data/blacklist.json');

class SockerIO {
    #vPrivateVar;
    vPublicVar;

    constructor(value = null) {};

    vSocketEvents(vSocket, sPassword) {
        vSocket.emit('vWindowsActualVolume', vAudio.get());

        vAudio.events.on('change', (vVal) => {
            vSocket.emit('vWindowsVolumeChange', vVal.new);
        });

        const aSessions = NodeAudioVolumeMixer.getAudioSessionProcesses();
        vSocket.emit('aSessions', aSessions);
        vSocket.emit('oAppBlacklist', oAppBlacklist);

        vSocket.on('ioActions', (ioActions) => {
            vSendInput.vInputs(ioActions, sPassword);
        });

        vSocket.on('ioVolumeMaster', (ioVolumeMaster) => {
            vWinAudio.vChangeMasterVolume(ioVolumeMaster, sPassword);
        });

        vSocket.on('ioMasterMute', (ioMasterMute) => {
            vWinAudio.vMuteMasterVolume(ioMasterMute, sPassword);
        });

        vSocket.on('ioVolumeApps', (ioVolumeApps) => {
            vNodeAudio.vShowProcessList(ioVolumeApps, sPassword);
        });

        vSocket.on('vMuteButton', (vMuteButton) => {
            vNodeAudio.vNodeAppMute(vMuteButton, sPassword);
        });
    }
}

module.exports = SockerIO;