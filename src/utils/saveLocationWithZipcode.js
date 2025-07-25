import { ZIPCODE_API_URL } from "../constants";

// Utility to save user location with zipcode
export async function saveLocationWithZipcode(zipcode) {
  try {
    const fetchZipcode = await fetch(`${ZIPCODE_API_URL}/${zipcode}`);
    const zipcodeResponse = await fetchZipcode.json();

    const formattedResponse = {
      zipcode: zipcodeResponse?.postCode,
      websiteCountry: zipcodeResponse?.country,
      websiteState: zipcodeResponse?.places[0]?.state,
      stateCode: zipcodeResponse?.places[0]?.stateAbbreviation,
      countryCode: zipcodeResponse?.countryAbbreviation,
      websiteCity: zipcodeResponse?.places[0]?.placeName,
      longitude: zipcodeResponse?.places[0]?.longitude,
      latitude: zipcodeResponse?.places[0]?.latitude,
    };

    const storedQuizData = JSON.parse(
      localStorage.getItem("quizValues") || "{}"
    );
    localStorage.setItem(
      "quizValues",
      JSON.stringify({
        ...storedQuizData,
        ...formattedResponse,
      })
    );
  } catch (error) {
    console.error(`Error in fetching zipcode data`, error.message);
  }
}
