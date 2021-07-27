const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const path = require("path");
const disbut = require('discord-buttons');
const math = require('mathjs');
const fs = require('fs');
disbut(client);
const { MessageButton, MessageActionRow } = require('discord-buttons');
const sons = require('./sons.json')
let sonsPaginado = [];
let todosSons = [];
const testFolder = './assets/SONS/';
require('dotenv').config();


fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        const som = {
            descricao: file.replace('.mp3', '').trim(),
            valor: file,
            arquivo: file
        }

        todosSons = [...todosSons, som]
    });
    sonsPaginado = paginate(todosSons, 5);
});

function paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
        let idx = Math.floor(i / size)
        let page = acc[idx] || (acc[idx] = [])
        page.push(val)

        return acc
    }, [])
}

client.on("ready", async () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores`);
    client.user.setPresence(`OnlyAine`);
});


client.on("guildCreate", guild => {
    console.log(`o Bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.size}`);
});

client.on("guildDelete", guild => {
    console.log(`o Bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serbing ${client.guilds.size} servers`);
});

function play(connection, som) {
    const dispatcher = connection.play(path.join(__dirname, `assets/SONS/${som}`));
}

function stop(connection, som) {
    const dispatcher = connection.play(path.join(__dirname, `assets/SONS/${som}`));
    dispatcher.destroy();
}

client.on('clickButton', async (button) => {
    const { voice } = button.clicker.member;

    voice.channel.join().then((connection) => {
        // const paginaFiltrada = sons.filter(som => som.find(s => s.valor === button.id))[0]
        // if (paginaFiltrada) {
        //     const somFiltrado = paginaFiltrada.filter(som => som.valor === button.id)[0]
        //     if (somFiltrado) {
        //         play(connection, somFiltrado.arquivo);
        //     }
        // }

        const paginaFiltrada = todosSons.filter(som => som.valor === button.id)[0]
        if (paginaFiltrada) {
            play(connection, paginaFiltrada.arquivo);
        }
    });

    try {
        await button.defer();
    }
    catch {
        (error) => {
            console.log(error)
        }
    }
});

function proximaPagina(message) {

}

function paginaAnterior() {

}

client.on('messageReactionAdd', (reaction_orig, user) => {
    if (reaction_orig.message.author.id === user.id) {
        return;
    }

    if (reaction_orig.emoji.name === "⏹️") {
        const { voice } = reaction_orig.message.member;

        if (!voice.channelID) {
            message.reply('You must be in a voice channel');
            return;
        }

        voice.channel.join().then((connection) => {
            stop(connection);
        });
    }

});

client.on('messageReactionRemove', (reaction_orig, user) => {
    if (reaction_orig.message.author.id === user.id) {
        return;
    }
    if (reaction_orig.emoji.name === "⏹️") {
        const { voice } = reaction_orig.message.member;

        if (!voice.channelID) {
            message.reply('You must be in a voice channel');
            return;
        }

        voice.channel.join().then((connection) => {
            stop(connection);
        });
    }
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === 'sons') {
        // const sonsPaginaLeitura = sonsPaginado;
        // const segundaPaginacao = paginate(sonsPaginado, 5);
        // let foo = [];



        // sonsPaginado.map(som => {
        //     foo = [...foo, som.map(som => {
        //         return button = new MessageButton()
        //             .setLabel(som.descricao)
        //             .setStyle('blurple')
        //             .setID(som.valor)
        //     })]
        // });
        // foo = sonsPaginado.map(som => {
        //     console.log(som)
        //     return new MessageButton()
        //         .setLabel(som.descricao)
        //         .setStyle('blurple')
        //         .setID(som.valor)
        // });

        // segundaPaginacao.map((lista, index) => {
        //     foo.push(lista.map(som => {
        //         return button = new MessageButton() 
        //             .setLabel(som.descricao)
        //             .setStyle('blurple')
        //             .setID(som.valor)
        //     }))
        // });

        // console.log(foo)


        let _sons = [];
        sons.forEach((lista, index) => {
            _sons = [..._sons, lista.map(som => {
                return button = new MessageButton()
                    .setLabel(som.descricao)
                    .setStyle('blurple')
                    .setID(som.valor)
            })]
        });

        let row = [];
        row = _sons.map(som => {
            return new MessageActionRow()
                .addComponents(som)
        })

        console.log(row)

        message.channel.send("Vários Sons", { components: [...row.map(r => r)] }).then(function (message) {
            message.react("⏹️")
        }).catch((error) => {
            console.log(error)
        });
    }

    if (comando === 'teste') {
        let _sons = [];
        _sons = todosSons.map(som => {
            return new MessageButton()
                .setLabel(som.descricao)
                .setStyle('blurple')
                .setID(som.valor)
        });

        const sonsPaginado = paginate(_sons, 5);

        let rows = [];

        sonsPaginado.forEach((lista, index) => {
            rows = [...rows, new MessageActionRow().addComponents(lista)]
        });

        const rowsPaginado = paginate(rows, 5);


        // console.log(rows)
        // rows.map(row => console.log(row))

        // let row = []; 
        // row = _sons.map(som => {
        //     return new MessageActionRow()
        //         .addComponents(som)
        // }) 

        // message.channel.send("Vários Sons", { components: rows[0] }).then(function (message) {
        //     message.react("⏹️")
        // }).catch((error) => {
        //     console.log(error)
        // });
        rowsPaginado.map(row => {
            message.channel.send("Vários Sons", { components: row }).then(function (message) {
                message.react("⏹️")
            }).catch((error) => {
                console.log(error)
            });
        })
    }

    if (comando === 'play') {
        if (!args[0]) return message.channel.send('escreve a parada né burro véio');

        termo = args.join(' ').toLowerCase();

        // const paginaFiltrada = sons.filter(som => som.find(s => {
        //     return (s.descricao.indexOf(termo) > -1 || s.descricao.toLowerCase() === termo)
        // }))[0];
        // console.log(termo)

        const somFiltrado = todosSons.filter(som => {
            return som.descricao.indexOf(termo) > -1 || som.descricao.toLowerCase() === termo
        })[0]

        // console.log(somFiltrado)


        if (somFiltrado) {
            const { voice } = message.member;

            if (!voice.channelID) {
                message.reply('You must be in a voice channel');
                return;
            }

            voice.channel.join().then((connection) => {
                play(connection, somFiltrado.arquivo);
            });
        }

        // if (paginaFiltrada) {
        //     const somFiltrado = paginaFiltrada.filter(som => {
        //         return (som.descricao.indexOf(termo) > -1 || som.descricao.toLowerCase() === termo)
        //     })[0];

        //     if (somFiltrado) {
        //         const { voice } = message.member;

        //         if (!voice.channelID) {
        //             message.reply('You must be in a voice channel');
        //             return;
        //         }

        //         voice.channel.join().then((connection) => {
        //             play(connection, somFiltrado.arquivo);
        //         });
        //     }
        // }
    }


    if (comando === 'playaudio') {
        const { voice } = message.member;

        if (!voice.channelID) {
            message.reply('You must be in a voice channel');
            return;
        }

        voice.channel.join().then((connection) => {
            connection.play(path.join(__dirname, 'assets/SONS/OVINHO DO MITPO.mp3'))
        });
    }

    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

    if (comando === "criticarcomim") {
        const m = await message.channel.send("Toda vez esse cara");
    }

    if (comando === "criticarjoao") {
        const m = await message.channel.send("Esse bixo só reclama");
    }

    if (comando === "disgrassa") {
        const embed = new Discord.MessageEmbed()
            .setColor(0x808080)
            .addField('DISGRASSA')
        // const m = await message.channel.send("DISGRASSA");
        message.channel.send(embed);
    }

    if (comando === "calc") {

        if (!args[0]) return message.channel.send('escreve o numro burro véio');

        let resp;

        try {
            resp = math.evaluate(args.join(" "))
        } catch (e) {
            return message.channel.send('tá errado animal')
        }

        const embed = new Discord.MessageEmbed()
            .setColor(0x808080)
            .setTitle('Calculadera')
            .addField('La Pregunta', `\`\`\`css\n${args.join(' ')}\`\`\``)
            .addField('Resposta', `\`\`\`css\n${resp}\`\`\``)

        message.channel.send(embed);

    }
});

client.login(process.env.DISCORD_TOKEN)