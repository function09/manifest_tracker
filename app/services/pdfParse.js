import fs from "fs";
import pdf from "pdf-parse";

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

const extractProductDescription = async (buffer) => {
  await pdf(buffer).then((data) => {
    /* 
    From experience, RnD flower tends to either be DUTR, DUFL, or Dry, 
    these variables handle these 3 exceptions 
    */

    const DUFLAndDUTR = data.text.match(/IN-DU[A-Z]+-[a-zA-Z]-[A-Z]+/g);
    const DryFlower = data.text.match(/IN-[a-zA-Z]+-[A-Z]+[-&A-Z]+(?=G10.000)/g);

    return DUFLAndDUTR || DryFlower;
  });
};

const extractQuantity = (buffer) => {
  pdf(buffer).then((data) => {
    console.log(data.text.match(/Qty:\d+.\d+/g));
  });
};
export { createMaterialAndBatchID, extractProductDescription, extractQuantity };
