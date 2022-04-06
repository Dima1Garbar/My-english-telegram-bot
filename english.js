//Telegrem bot
const TelegramBot = require('node-telegram-bot-api')
const talegram_translation = require('translation-google')
const token = '5111912871:AAHNb8DvfGLHoelXn43kcLwZJwceqthk-a4';
const bot = new TelegramBot(token, {polling: true});

const fs = require('fs');
const fileName_ukr = './list_of_words/ukr.json'
const fileName_engl = './list_of_words/english.json'
const fileName_all = './list_of_words/words.json'

const file_ukr = require(fileName_ukr);
const file_engl = require(fileName_engl);
const file_all = require(fileName_all)

var work = '';
var translate_all = false;
var add_word_ukr = false;
var add_word_engl = false;
var add_word_to_list = false;

bot.onText(/add_word/, (msg, match) => {
    const chatId = msg.chat.id;
    work = 'add_the _word'
    add_word_to_list = true
    
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
        add_word_to_list = false;
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

      
    }

    

    if (msg.text === 'Додати слово українською'){
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

    if (msg.text === 'Додати слово англійською'){
        add_word_engl = true;
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



/*
//console.log(file.table[0]['roof'])
//fs.writeFileSync(fileName, JSON.stringify(obj));

//get all keys
/*
var keys = [];
for(var i = 0; i < file.table.length;i++){
    Object.keys(file.table[i]).forEach(function(key){
        if(keys.indexOf(key) == -1)
        {
            keys.push(key);
        }
    });
}
console.log(keys);
*/


//add a word to json file 
/*
fs.readFile(fileName, 'utf8', function readFileCallback(err, data){
  if (err){
      console.log(err);
  } else {
  obj = JSON.parse(data); 
  obj["rock"] = "камінь";
  json = JSON.stringify(obj); //convert it back to json
  fs.writeFile(fileName, json, function writeJSON(err){});
}});
*/


/*
test = {}

test['1'] = 'q'
test['2'] = 'w'
test['3'] = 'e'
test['4'] = 'r'
test['5'] = 't'

test2 = {}

var k_eys = Object.keys(test)
for (var i = 0; i < Object.keys(test).length; i++){
    k_ey = k_eys[i]
    vallues = test[k_eys[i]]
    test2[vallues] = k_ey
}

console.log(test)
console.log(test2)

var k_eys = Object.keys(test2)
for (var i = 0; i < Object.keys(test2).length; i++){
    k_ey = k_eys[i]
    vallues = test2[k_eys[i]]
    test[vallues] = k_ey
}

console.log(test2)
console.log(test)







if (work != '' && add_word_ukr === true){

    var ukr_word = msg.text;
    async function trans(){
        var translator = await talegram_translation (ukr_word, {from: 'uk', to: 'en'});
        fs.readFile(fileName_ukr, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); 
            obj[ukr_word] = translator['text'];
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(fileName_ukr, json, function writeJSON(err){});
        }});
    }
    trans()
    bot.sendMessage(chatId, ukr_word)
}

if (work != '' && add_word_engl === true){

    var engl_word = msg.text;
    async function trans(){
        var translator = await talegram_translation (engl_word, {from: 'uk', to: 'en'});
        fs.readFile(fileName_engl, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); 
            obj[engl_word] = translator['text'];
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(fileName_engl, json, function writeJSON(err){});
        }});
    }
    trans()
    bot.sendMessage(chatId, engl_word)
}
test("foo", () => {
    Promise.reject(new Error());
    expect(1).toBe(1);
  });*/
