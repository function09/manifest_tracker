import fs from "fs";
import pdf from "pdf-parse";

const createMaterialAndBatchID = async (buffer) => {
  const materialAndBatchIDList = [];

  try {
    const data = await pdf(buffer);
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
    console.log(materialAndBatchIDList);
    return materialAndBatchIDList;
  } catch (error) {
    console.log(error);
  }
};

const extractProductDescription = async (buffer) => {
  try {
    const data = await pdf(buffer);
    /* 
    From experience, RnD flower tends to either be DUTR, DUFL, or Dry, 
    these variables handle these 3 exceptions 
    */

    const DUFLAndDUTR = data.text.match(/IN-DU[A-Z]+-[a-zA-Z]-[A-Z]+/g);
    const DryFlower = data.text.match(/IN-[a-zA-Z]+-[A-Z]+[-&A-Z]+(?=G10.000)/g);
    console.log(DUFLAndDUTR || DryFlower);
    return DUFLAndDUTR || DryFlower;
  } catch (error) {
    console.log(error);
  }
};

const extractQuantity = async (buffer) => {
  try {
    const data = await pdf(buffer);
    console.log(data.text.match(/Qty:\d+.\d/g));
    return data.text.match(/Qty:\d+.\d+/g);
  } catch (error) {
    console.log(error);
  }
};

const createItem = (materialAndBatch, productDescription, quantity, source) => {
  console.log(materialAndBatch(source), productDescription(source), quantity(source));
};

export { createMaterialAndBatchID, extractProductDescription, extractQuantity, createItem };
