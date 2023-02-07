'use strict';

const axios = require('axios')
const timeNaw = require("./timeNaw");

const axiosModel = require("./axiosModel");
const cron = require("node-cron");
const { S7Client } = require("s7client");
//Hi!Александр Славинский (sj39n1ndKk+UOtZjt4x0Iw==)',
//me  FiFBOtd/Mz/Oo+5rlVKsyg==
 console.log("Started  ", timeNaw());
const asp = {
    hardware: {
        name: "Aspiration",
        host: "192.168.10.133",
        port: 102,
        rack: 0,
        slot: 2,
        maxRetryDelay: 1000,
        alivePkgCycle: 10
    },
};

let firstIteration = false

let oldData = ""
cron.schedule("*/30 * * * * *", () => {
    const client = new S7Client(asp.hardware);
    client.on("error", console.error);
    async function errorFunc() {
        let res
        try {
            //console.log("normalWorking")
            if (client.isConnected() === false) { await client.connect() }
            res = await client.readVars([{ area: "mk", type: "BYTE", start: 150 }]);
            res = res[0].value
            if (!res) { return }
            console.log(res, oldData, "data  ", timeNaw());
            client.disconnect()

            if (firstIteration === false) { oldData = res; firstIteration = true}
		
		let usrs= [
		"FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
		"Q6CHsKL2hR9aHZnGOOjl7g==", //елена
		//"IPrDMpwadYxr1JhskQUQfw==", //ирина
		"9ANHiCXZqG3G8RAt56tU5g==", //Kostya
        "GQgzGweXkZ/glVKg5bPxXA==", // Oleg
        "sj39n1ndKk+UOtZjt4x0Iw==", // slavinsk
        "91kgDvC/WPhttelZZrITow==", // Максим
        "GcIM8lOzwgpbp+njykxmJQ==", // Ivan Cherkasov
        "JK/VX+MSUkDjO1V/DYIg1Q==", // Николай
        "V5tthDMqEs1PT/nCQpBgpw==", // Viktor
        "6pMjE81DtpbPAr+pRjswfw==", // Dmitriy  Hrihorenko
        "IPirRThqT5VC6pEtgtfgDg==", // Александр
        "BrUPsORClgJMqoSrEYMcBQ==", // Максим
        "QzdgH8J0AAX0d8wDpQPdmQ==", // Діма Благий
        "akGqSvSChKPujvRBdacEew==", // гумнюк
	"IVKwDiqLpwBVwdov0hLnZw==", // ярик
	"ulBn4UnvhVJ35zM1IVCXYw==" ,// Валентин:
	"EveMeYA0xkdq1XK4LUBK3g==",// леша 1с
	"BTqjdju0usLDL9MCSub9PA==",// Дима нач Ит
	"ENLI89rvLtuRUm2Fyr6MJw==",// Лиля
    "0ht677bzD9yGMq/EF5/wLA==",//Panasyuk Vladymir
  
]

let usrs2=[
"FiFBOtd/Mz/Oo+5rlVKsyg==", //YA
]

            if (oldData != res) {
                console.log(res, oldData, "Sending Messages", timeNaw());
		usrs.map(e=>axiosModel(e, res))
	
 		oldData = res


            }
        } catch (err) {
            console.log(err, "error Line");
            return;
        }

    }

    errorFunc()

})



//(party_popper)(party_popper)(party_popper)