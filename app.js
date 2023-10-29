const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));

//TODO: DB stuff later
const mongoose = require("mongoose");

//email js
const emailjs = require("@emailjs/nodejs");
const { log } = require("console");


//config for environmental variables
require('dotenv').config();

// const boxingArsenal = require("boxingArsenal");
// // import {boxingArsenal} from "./boxingArsenal.js";
// console.log(boxingArsenal);

//boxing arrays
const straightPunches = ["1","2","1 body","2 body"];
const powerPunches = ["3","4","5","6","3 body","4 body","5 body", "6 body"];
const defence = ["slip left", "slip right", "block left", "block right", "block left body", "block right body", "parry jab", "parry cross", "catch left", "catch right"]
const movement = ["step left", "step right", "step forward", "step back"];
const feint = ["feint 1", "feint 2", "feint 3", "feint 4", "feint 5", "feint 6"];
const boxingArsenal = [straightPunches,powerPunches,defence,movement,feint];

function generateCombo(comboLength){
    
    var lastChosenArsenal = -1;
    for(var index = 0; index < comboLength; index++){

        if(lastChosenArsenal === 4){
            var arsenalIndex = Math.floor((Math.random() * boxingArsenal.length-1));
        }
        else {
            var arsenalIndex = Math.floor((Math.random() * boxingArsenal.length));
        }
        
        var chosenArsenal = boxingArsenal[arsenalIndex];
        var randomBoxingIndex = Math.floor((Math.random() * chosenArsenal.length));

        if(index === 0){
            combo = chosenArsenal[randomBoxingIndex];
        }
        else{
        combo = combo + " | " + chosenArsenal[randomBoxingIndex];
        }
        
        lastChosenArsenalIndex = arsenalIndex;
    }
    return combo;
}

app.get("/generate/random/combos", (req,res) => {
    
    var { easyCombo, mediumCombo, hardCombo } = generateCombos();
    
    res.send({
        easyCombo: easyCombo,
        mediumCombo: mediumCombo,
        hardCombo: hardCombo
    });
});

app.get("/generate/random/combo/send/mail", (req,res) => {

    var { easyCombo, mediumCombo, hardCombo } = generateCombos();

    var templateParams = {
        subject: "Your Boxing Combos For The Day",
        fromName: "The Survey Corps",
        notes: "Boxing Combos For The Day!",
        combosForTheDay: {easyCombo: easyCombo,
        mediumCombo: mediumCombo,
        hardCombo: hardCombo}
    };

    console.log('====================================');
    console.log();
    console.log('====================================');

    emailjs.send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, templateParams, {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY}).then((response) => {
      console.log("combo email successfully sent.", response.status, response.text);
      response.text = "Combo email successfully sent.";
      res.send(response.text);
    }, (err) => {
      console.log("FAILED...", err);
      res.status("500");
      res.send("Failed to send email.");
    },
  );
});

app.listen(port, () => {
    console.log("Listening on port", port);
})

function generateCombos() {
    const easyComboLength = 3;
    const mediumComboLength = 5;
    const hardComboLength = 7;

    var easyCombo = generateCombo(easyComboLength);
    var mediumCombo = generateCombo(mediumComboLength);
    var hardCombo = generateCombo(hardComboLength);
    return { easyCombo, mediumCombo, hardCombo };
}
