const Commando = require('discord.js-comando');

module.exports = class PlayAudioCommand extends Commando.Command {
    constructor(cliente) {
        super(cliente, {
            name: 'playaudio',
            group: 'misc',
            memberName: 'playaudio',
            description: 'Plays some audio'
        });
    }

    async run(message) {
        const { voice } = message.member;

        if (!voice.channelID) {
            message.reply('You musc be in a voice channel');
            return;
        }

        voice.channel.join();
    }
}