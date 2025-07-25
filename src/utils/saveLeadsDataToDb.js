import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants/index";
import {
  getCurrentURL,
  getDomainName,
  getScreenResolutionStr,
} from "./windowUtils";

const saveLeadsDataToDb = async (leadsUrl) => {
  try {
    const screenResolution = getScreenResolutionStr();
    const domainName = getDomainName();
    const finalUrl = getCurrentURL();

    const saveLeadsData = await fetch(leadsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || "{}"
          ),
          domainName,
          finalUrl,
          screenResolution,
        },
      }),
    });

    await saveLeadsData.json();
  } catch (error) {
    console.error(`Error in saving leads data`, error.message);
  }
};

export default saveLeadsDataToDb;
