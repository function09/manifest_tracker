import fs from "fs";
import pdf from "pdf-parse";

const extractManifestDetails = async (buffer) => {
  try {
    /*
    If the accession of the text property were after the pdf call, 
    it would not resolve, the then fixes this
    */
    const data = await pdf(buffer).then((result) => result.text.replace(/\s/g, ""));
    const manifestObject = {
      sendingWarehouse: data.match(/Warehouse:(.*)Document/)[1],
      documentNumber: data.match(/No.:(.*)Departure/)[1],
      departureDate: data.match(/DepartureDate:(.*?)Time/)[1],
      arrivalDate: data.match(/ArrivalDate:(.*?)Time/)[1],
    };
    return manifestObject;
  } catch (error) {
    console.log(error);
  }
};

const extractMaterialAndBatchID = async (buffer) => {
  const materialAndBatchIDList = [];

  try {
    const data = await pdf(buffer);
    const numericalStringsList = data.text.match(/\d+/g);
    /*
    The material numbers are five digits and prefixed by the ref #,
    the ref # needs to be removed
    */

    const refWithMaterialNumber = numericalStringsList.filter((string) => string.length === 7);
    const materialNumbers = refWithMaterialNumber.map((string) => string.substring(2, 7));
    const batchNumbers = numericalStringsList.filter((string) => string.length === 10 && string.substring(0, 1) === "0");

    materialNumbers.forEach((number, index) => {
      materialAndBatchIDList.push(`${number}_${batchNumbers[index]}`);
    });

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

    return DUFLAndDUTR || DryFlower;
  } catch (error) {
    console.log(error);
  }
};

const extractQuantity = async (buffer) => {
  try {
    const data = await pdf(buffer);

    return data.text.match(/Qty:\d+.\d+/g);
  } catch (error) {
    console.log(error);
  }
};

const createItems = async (buffer) => {
  try {
    const items = await extractMaterialAndBatchID(buffer);
    const itemDescription = await extractProductDescription(buffer);
    const itemQuantity = await extractQuantity(buffer);

    const itemsObject = items.map((item, index) => ({
      materialAndBatch: item,
      description: itemDescription[index],
      itemQuantity: itemQuantity[index],
    }));

    return itemsObject;
  } catch (error) {
    console.log(error);
  }
};

// Refactor this to use promise.all, all functions calls here are indepdent of each other
const createManifestObject = async (buffer) => {
  try {
    const manifestData = { ...(await extractManifestDetails(buffer)), items: await createItems(buffer) };

    return manifestData;
  } catch (error) {
    console.log(error);
  }
};

export default createManifestObject;
