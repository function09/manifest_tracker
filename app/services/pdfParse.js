import fs from "fs";
import pdf from "pdf-parse";

async function convertPDFtoText(buffer) {
  const materialAndBatchID = [];
  await pdf(buffer).then((data) => {
    const allNumbers = data.text.match(/\d+/g);
    // This this returns a new array with the QR code and document number as the first 2 values
    const sevenDigits = allNumbers.filter((number) => number.length === 7);
    const correctValue = sevenDigits.splice(2, 9);
    const batch = allNumbers.filter((number) => number.length === 10 && number.substring(0, 1) === "0");
    const material = correctValue.map((index) => index.substring(2, 7));

    console.log(batch);

    // material.forEach((number, index) => {
    //   materialAndBatchID.push(`${number}_${batch[index]}`);
    // });
  });
}

const createMaterialAndBatchID = async (buffer) => {
  const materialAndBatchIDList = [];

  await pdf(buffer).then((data) => {
    const numericalStringsList = data.text.match(/\d+/g);

    /* 
    The material numbers are five digits and prefixed by the ref #,
    the ref # eeds to be removed
    */
    const refWithMaterialNumber = numericalStringsList.filter((string) => string.length === 7);
    const materialNumbers = refWithMaterialNumber.map((string) => string.substring(2, 7));
    const batchNumbers = numericalStringsList.filter((string) => string.length === 10 && string.substring(0, 1) === "0");

    materialNumbers.forEach((number, index) => {
      materialAndBatchIDList.push(`${number}_${batchNumbers[index]}`);
    });
  });
  return materialAndBatchIDList;
};

export default createMaterialAndBatchID;
