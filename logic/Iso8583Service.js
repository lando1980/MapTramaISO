const constantes = require("../logic/constantes");
const iso8583 = require("iso_8583");
const hex2ascii = require("hex2ascii");

async function getIso8583_A(req, res) {
  let numeroTrama = 12;
  let bitMapData;
  let JSONtotal = {};
  let isoJson = {};
  let adicional_126 = {};

  if (req.query.cadenaHex !== undefined) {
    bitMapData = hex2ascii(req.query.cadenaHex);
  } else bitMapData = req.body.cadenaAscci;

  //console.log("Ascci:   " + bitMapData);
  bitMapData = bitMapData.substring(numeroTrama);
  const config = {
    lenHeader: false,
    lenHeaderEncoding: "utf8",
    bitmapEncoding: "utf8",
    secondaryBitmap: true,
    hasSpecialFields: true,
  };

  let customFormats = {
    41: {
      LenType: "fixed",
      MaxLen: 16,
    },
    52: {
      LenType: "fixed",
      MaxLen: 16,
    },
    55: {
      LenType: "lllvar",
      MaxLen: 999,
    },
  };

  let incoming = new iso8583(bitMapData, customFormats).getIsoJSON(
    new Buffer.alloc(bitMapData.length, bitMapData),
    config
  );
  //console.log(bitMapData.getBitMapFields());

  for (let k in incoming) {
    let descripcion = iso8583.getFieldDescription([k]);
    if (k !== "126") isoJson[k + "   " + descripcion[k]] = incoming[k];
  }

  //console.log(isoJson);
  //console.log("Bitmap:  " + incoming.length);
  JSONtotal[0] = isoJson;
  if (incoming["126"] !== undefined) {
    let dato126 = incoming["126"].split("!");
    dato126.forEach((element, index) => {
      //console.log(element+" "+index);
      if (index !== 0)
        for (let j in Object.keys(constantes)) {
          const token = element.substring(1, 3);
          if (token === Object.keys(constantes)[j]) {
            const parametros = constantes[token];
            let contador = 9;
            const obj = {};
            for (let k in parametros) {
              obj[`${parametros[k].name}`] = element.substring(
                contador,
                contador + parametros[k].length
              );
              contador += parametros[k].length;
            }
            adicional_126[token] = obj;
          }
        }
    });
    JSONtotal[126] = adicional_126;
  }
  //console.log(adicional_126);
  res.send(JSONtotal);
}

async function getIso8583_B(req, res) {
  let numeroTrama = 3;
  let bitMapData;
  let JSONtotal = {};
  let isoJson = {};
  let adicional_126 = {};

  if (req.query.cadenaHex !== undefined) {
    bitMapData = hex2ascii(req.query.cadenaHex);
  } else bitMapData = req.body.cadenaAscci;

  //console.log("Ascci:   " + bitMapData);
  bitMapData = bitMapData.substring(numeroTrama);
  const config = {
    lenHeader: false,
    lenHeaderEncoding: "utf8",
    bitmapEncoding: "utf8",
    secondaryBitmap: true,
    hasSpecialFields: true,
  };

  let customFormats = {
    2: {
      LenType: "fixed",
      MaxLen: 21,
    },
  };

  let incoming = new iso8583(bitMapData, customFormats).getIsoJSON(
    new Buffer.alloc(bitMapData.length, bitMapData),
    config
  );
  //console.log(bitMapData.getBitMapFields());

  for (let k in incoming) {
    let descripcion = iso8583.getFieldDescription([k]);
    if (k !== "126") isoJson[k + "   " + descripcion[k]] = incoming[k];
  }

  //console.log(isoJson);
  //console.log("Bitmap:  " + incoming.length);
  JSONtotal[0] = isoJson;
  if (incoming["126"] !== undefined) {
    let dato126 = incoming["126"].split("!");
    dato126.forEach((element, index) => {
      //console.log(element+" "+index);
      if (index !== 0)
        for (let j in Object.keys(constantes)) {
          const token = element.substring(1, 3);
          if (token === Object.keys(constantes)[j]) {
            const parametros = constantes[token];
            let contador = 9;
            const obj = {};
            for (let k in parametros) {
              obj[`${parametros[k].name}`] = element.substring(
                contador,
                contador + parametros[k].length
              );
              contador += parametros[k].length;
            }
            adicional_126[token] = obj;
          }
        }
    });
    JSONtotal[126] = adicional_126;
  }
  //console.log(adicional_126);
  res.send(JSONtotal);
}

async function getAscciFromHex(req, res) {
  let data = req.query.cadenaHex;

  let bitMapData = hex2ascii(data);

  console.log(bitMapData);
  res.send(JSON.stringify(bitMapData));
}

module.exports.getIso8583_A = getIso8583_A;

module.exports.getIso8583_B = getIso8583_B;

module.exports.getAscciFromHex = getAscciFromHex;
