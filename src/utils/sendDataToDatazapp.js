import { DATAZAPP_CONFIG } from "../constants";
import { formatDatazAppResponse } from "./formatDatazAppResponse";

export const sendDataToDatazapp = async (fname, lname, email, phoneNumber) => {
  const { API_KEY, BASE_URL } = DATAZAPP_CONFIG;

  const payload = {
    ApiKey: API_KEY,
    AppendModule: "DemographyAppend",
    OutputColumn: [
      "Age",
      "Address",
      "Education",
      "Marital_Status",
      "Gender",
      "Ethnicity",
      "Income",
      "Occupation",
      "Presence_of_Child",
      "Home_Owner",
      "LOR",
      "Dwelling_Type",
      "Home_Value",
      "Dog_Owner",
      "Cat_Owner",
      "Diet_Weight_Loss",
      "Golf_Enthusiasts",
      "Travel_Cruise_Vacations",
      "Travel_International",
      "Arts_Cultural",
      "Animal_Welfare",
      "Childrens_Causes",
      "Environmental_Causes",
      "International_Aid",
      "Religious",
      "Veterans",
      "NumberOfChildren",
      "Party-Leaning_D",
      "Party-Leaning_R",
      "Political_Donor",
      "Unregistered_Voter",
      "Signal_Accredited_Investor",
      "Signal_EV_Purchase",
      "Signal_High_Networth",
      "Propensity_to_Give",
      "Signal_Seller_Score",
      "Signal_Solar_Intenders",
    ],
    Data: [
      {
        Email: email,
        FirstName: fname,
        LastName: lname,
        Zip: null,
        Phone: phoneNumber,
      },
    ],
  };

  try {
    if (!fname || !lname || !email || !phoneNumber) {
      throw new Error("All fields are required");
    }
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Datazapp API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data?.ResponseDetail?.Data?.length > 0)
      return formatDatazAppResponse(data?.ResponseDetail?.Data[0]);
  } catch (error) {
    console.error("Error sending data to Datazapp:", error);
  }
};

//https://track.nationwidesubsidy.com/2929965d-3bc1-4127-9be4-9574d4a46408
