//Telegrem bot
const TelegramBot = require('node-telegram-bot-api')
const talegram_translation = require('translation-google')
const token = '5111912871:AAHNb8DvfGLHoelXn43kcLwZJwceqthk-a4';
const bot = new TelegramBot(token, {polling: true});

const fs = require('fs');
const fileName_all = './list_of_words/english.json'

var work = '';
var translate_all = false;
var add_word_ukr = false;
var add_word_engl = false;
var add_word_to_list = false;
var only_ukr = false;
var only_engl = false;
var show_all = false;
var check_word = false;
var true_word = false;
var true_user = false;

var list_of_english_words = ' qwertyuiopasdfghjklzxcvbnm';
var list_of_ukrainian_words = ' йцукенгшщзхїфівапролджєячсмитьбю';
var spec_symbol = '!@#$%^&*()_-+="№;%:?/*[]{}|.,123456789'



function check_message(mes, type_of_word){
    for (var i = 0; i < mes.length; i++){
        for (var j = 0; j < spec_symbol.length; j++){
            if (mes[i] === spec_symbol[j]){
                return false;
            }
        }}
    for (var i = 0; i < mes.length; i++){
        if (type_of_word === 'ukr'){
            for (var j = 0; j < list_of_english_words.length; j++){
                if (mes[i] === list_of_english_words[j]){
                    return false;
                }
                else if(i === mes.length-1){
                    return true
                }
            }
        }
        else if (type_of_word === 'eng'){
            for (var j = 0; j < list_of_ukrainian_words.length; j++){
                if (mes[i] === list_of_ukrainian_words[j]){
                    return false;
                }
                else if(i === mes.length-1){
                    return true
                }
            }
        }
    }
}

bot.onText(/add_word/, (msg, match) => {

    const chatId = msg.chat.id;

    add_word_to_list = true;
    work = 'add_the_word';
    
    translate_all = false;
    add_word_ukr = false;
    add_word_engl = false;
    only_ukr = false;
    only_engl = false;
    show_all = false;
    check_word = false;
    true_word = false;
    true_user = false;


    bot.sendMessage(chatId, "Add a word",{
        reply_markup: {
            keyboard: [
                ['Додати слово українською', 'Додати слово англійською'],
                ['Cancel']
            ]
        },
       }
    );
});


bot.onText(/translate/, (msg, match) => {

    const chatId = msg.chat.id;

    work = '';
    translate_all = false;
    add_word_ukr = false;
    add_word_engl = false;
    add_word_to_list = false;
    only_ukr = false;
    only_engl = false;
    show_all = false;
    check_word = false;
    true_word = false;
    true_user = false;
    
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

bot.onText(/show_list/, (msg, match) => {

    const chatId = msg.chat.id;

    work = 'show_list';

    translate_all = false;
    add_word_ukr = false;
    add_word_engl = false;
    add_word_to_list = false;
    only_ukr = false;
    only_engl = false;
    show_all = false;
    check_word = false;
    true_word = false;
    true_user = false;
    
    bot.sendMessage(chatId, "My list",{
        reply_markup: {
            keyboard: [
                ['Тільк українські слова', 'Тільки англійські слова'],
                ['Українські - Англійські'],
                ['Cancel']
            ]
        }
       }
    );
})

bot.on('message', (msg) => {

    const chatId = msg.chat.id;

    if (msg.text === 'Cancel'){
        bot.sendMessage(chatId, 'Cancel',{
            reply_markup:{
                remove_keyboard: true
            }
        })
        work = '';
        translate_all = false;
        add_word_ukr = false;
        add_word_engl = false;
        add_word_to_list = false;
        only_ukr = false;
        only_engl = false;
        show_all = false;
        true_word = false;
        check_word = false;
    
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

    if (msg.text === 'Back' && add_word_to_list == true){
        bot.sendMessage(chatId, 'Add a word',{
            reply_markup:{
                remove_keyboard: true
            },
            reply_markup: {
                keyboard: [
                    ['Додати слово українською', 'Додати слово англійською'],
                    ['Cancel']
                ]
            }
        })
        add_word_ukr = false;
        add_word_engl = false;}
    
    if (check_word === true){
        var message = ''
        if (add_word_engl === true){
            message =  check_message(msg.text, 'eng')}
        else if (add_word_ukr === true){
            message =  check_message(msg.text, 'ukr')}
        
        if (message == true){
            true_word = true;
        }
        else if (message == false){
            true_word = false;
            bot.sendMessage(chatId, 'Введіть слово без спеціальних символів!')
        }
    }

    if (work != '' ){
        if (translate_all === true){
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
        if (add_word_to_list === true && true_word === true){{
            if ((add_word_engl === true || add_word_ukr === true) && true_word === true){
            var typed_word = msg.text;
            var translate_word = {}
            async function trans(){
            if (add_word_engl == true){
                var translator = await talegram_translation (typed_word, {from: 'en', to: 'uk'});
                translate_word[typed_word] = translator['text'];
            }
            else if (add_word_ukr == true){
                var translator = await talegram_translation (typed_word, {from: 'uk', to: 'en'});
                translate_word[translator['text']] = typed_word;
            };
            fs.readFile(fileName_all, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                chatId =  chatId.toString()
                var k_eys_chatid = Object.keys(obj);
                var key_translate_word = Object.keys(translate_word);
                chatId_str = chatId.toString()
                for (i = 0; i < k_eys_chatid.length; i++){
                    if (obj[k_eys_chatid[i]] === chatId_str){
                        obj[k_eys_chatid[i]][key_translate_word] = translate_word[key_translate_word]
                    }
                    else if (i === k_eys_chatid.length -1 && obj[k_eys_chatid[i]] != chatId){
                        obj[chatId] = {}
                        obj[chatId][key_translate_word] = translate_word[key_translate_word]
                    }
                }
                
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile(fileName_all, json, function writeJSON(err){});
            }});
            }
        trans()
        bot.sendMessage(chatId, 'Added ' + typed_word)
        }}}
        if (work === 'show_list'){
            fs.readFile(fileName_all, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);
                var k_eys_chatid = Object.keys(obj);
                chatId_str = chatId.toString()
                for (i = 0; i < k_eys_chatid.length; i++){
                    if (k_eys_chatid[i] === chatId_str){
                        true_user = true;
                    }
                    else if (i === k_eys_chatid.length-1 && true_user === false){
                        console.log(i === k_eys_chatid.length-1 && k_eys_chatid[i] != chatId_str)
                        obj[chatId] = {}
                    }
                }
                if  (only_ukr === true && true_user === true){
                    if (Object.keys(obj[chatId_str]).length === 0) {
                        bot.sendMessage(chatId, "Ваш список слів пустий")
                    }
                    else{
                        var keys_list = Object.keys(obj[chatId_str])
                        for (var i = 0; i < keys_list.length; i++){
                            bot.sendMessage(chatId, obj[chatId_str][keys_list[i]])
                        }
                    }
                    only_ukr = false;
                   
                }
                else if (only_engl === true && true_user === true){
                    if (Object.keys(obj[chatId_str]).length === 0) {
                        bot.sendMessage(chatId, "Ваш список слів пустий")
                    }
                    else{
                        var keys_list = Object.keys(obj[chatId_str])
                        for (var i = 0; i < keys_list.length; i++){
                            bot.sendMessage(chatId, keys_list[i])
                        }
                    }
                    only_engl = false;
                }
                else if (show_all === true && true_user === true){
                    if (Object.keys(obj[chatId_str]).length === 0) {
                        bot.sendMessage(chatId, "Ваш список слів пустий")
                    }
                    else{
                        var keys_list = Object.keys(obj[chatId_str])
                        for (var i = 0; i < keys_list.length; i++){
                            bot.sendMessage(chatId, obj[chatId_str][keys_list[i]] + ' - ' + keys_list[i])
                        }
                    }
                    show_all = false;
                }
                else if (true_user === false){
                    bot.sendMessage(chatId, "Ваш список слів пустий")
                }
            }});
        } 
    }

    

    if (msg.text === 'Додати слово українською'){
        add_word_ukr = true;
        check_word = true;
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

    if (msg.text === 'Додати слово англійською'){
        add_word_engl = true;
        check_word = true;
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

    if (msg.text === 'Тільк українські слова'){
        only_ukr = true;
    }
    else if (msg.text === 'Тільки англійські слова'){
        only_engl = true;
    }
    else if (msg.text === 'Українські - Англійські'){
        show_all = true;
    }
    
});
