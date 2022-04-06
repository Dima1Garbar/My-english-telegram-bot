//Telegrem bot
const TelegramBot = require('node-telegram-bot-api')
const talegram_translation = require('translation-google')
const token = '5111912871:AAHNb8DvfGLHoelXn43kcLwZJwceqthk-a4';
const bot = new TelegramBot(token, {polling: true});

const fs = require('fs');
const fileName_ukr = './list_of_words/ukr.json'
const fileName_engl = './list_of_words/english.json'

const file_ukr = require(fileName_ukr);
const file_engl = require(fileName_engl);

var work = '';
var translate_all = false;
var add_word_ukr = false;
var add_word_engl = false;

bot.onText(/add_word/, (msg, match) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, "Add a word",{
        reply_markup: {
            keyboard: [
                ['Додати українське слово', 'Додати англійське слово'],
                ['Cancel']
            ]
        },
       }
    );
});


bot.onText(/translate/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Translate",{
        reply_markup: {
            keyboard: [
                ['Переклад з української на ангійську', 'Переклад з англійської на українську'],
                ['Cancel']
            ]
        }
       }
    );
})

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === 'Cancel'){
        translate_all = false
        bot.sendMessage(chatId, 'Cancel',{
            reply_markup:{
                remove_keyboard: true
            }
        })
        work = '';
        add_word_engl = false;
        add_word_ukr = false;
        translate_all = false;
    }

    if (msg.text === 'Back' && translate_all == true){
        bot.sendMessage(chatId, 'Translate',{
            reply_markup:{
                remove_keyboard: true
            },
            reply_markup: {
                keyboard: [
                    ['Переклад з української на ангійську', 'Переклад з англійської на українську'],
                    ['Cancel']
                ]
            }
        })
        translate_all = false;}

    if (msg.text === 'Back' && add_word_ukr == true){
        bot.sendMessage(chatId, 'Add a word',{
            reply_markup:{
                remove_keyboard: true
            },
            reply_markup: {
                keyboard: [
                    ['Додати українське слово', 'Додати англійське слово'],
                    ['Cancel']
                ]
            }
        })
        add_word_ukr = false;}
    

    if (work != '' && translate_all === true){
    
        async function trans(){
            var text = msg.text;
            if (work === 'translate_fro_ukr_to_engl'){
                var translator = await talegram_translation (text, {from: 'uk', to: 'en'});
            }
            else{
                var translator = await talegram_translation (text, {from: 'en', to: 'uk'});
            }
            bot.sendMessage(chatId, translator['text'])
        }
        trans()
    }

    if (msg.text === 'Додати українське слово'){
        add_word_ukr = true;
        bot.sendMessage(chatId, 'Введіть слово!',{
            reply_markup:{
                remove_keyboard: true,
            },
            reply_markup:{keyboard: [
                ['Back'],
                ['Cancel']
            ]}
        })
    }

    if (msg.text === 'Переклад з української на ангійську'){
        work = 'translate_fro_ukr_to_engl';
        translate_all = true;

    
        bot.sendMessage(chatId, 'Введіть що ви хочите перевести',{
            reply_markup:{
                remove_keyboard: true,
            },
            reply_markup:{keyboard: [
                ['Back'],
                ['Cancel']
            ]}
        })
    }
    else if (msg.text === 'Переклад з англійської на українську'){
        work = 'translate_fro_engl_to_ukr';
        translate_all = true;

        bot.sendMessage(chatId, 'Введіть що ви хочите перевести',{
            reply_markup:{
                remove_keyboard: true,
            },
            reply_markup:{keyboard: [
                ['Back'],
                ['Cancel']
            ]}
        })
    }
});

