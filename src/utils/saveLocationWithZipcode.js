import { ZIPCODE_API_URL } from '../constants';

// Utility to save user location with zipcode
export async function saveLocationWithZipcode(zipcode) {
  try {
    if (!zipcode) return;

    const fetchZipcode = await fetch(`${ZIPCODE_API_URL}/${zipcode}`);
    const zipcodeResponse = await fetchZipcode.json();

    const formattedResponse = {
      websiteZip: zipcodeResponse?.postCode || localStorage.getItem('websiteZip') || '',
      websiteCountry: zipcodeResponse?.country || localStorage.getItem('websiteCountry') || '',
      websiteState:
        zipcodeResponse?.places && zipcodeResponse?.places.length > 0
          ? zipcodeResponse?.places[0]?.state
          : localStorage.getItem('websiteState') || '',
      stateCode:
        zipcodeResponse?.places && zipcodeResponse?.places.length > 0
          ? zipcodeResponse?.places[0]?.stateAbbreviation
          : localStorage.getItem('stateCode') || '',
      countryCode:
        zipcodeResponse?.countryAbbreviation || localStorage.getItem('countryCode') || '',
      websiteCity:
        zipcodeResponse?.places && zipcodeResponse?.places.length > 0
          ? zipcodeResponse?.places[0]?.placeName
          : localStorage.getItem('websiteCity') || '',
      longitude:
        zipcodeResponse?.places && zipcodeResponse?.places.length > 0
          ? zipcodeResponse?.places[0]?.longitude
          : localStorage.getItem('longitude') || '',
      latitude:
        zipcodeResponse?.places && zipcodeResponse?.places.length > 0
          ? zipcodeResponse?.places[0]?.latitude
          : localStorage.getItem('latitude') || '',
    };

    const storedQuizData = JSON.parse(localStorage.getItem('quizValues') || '{}');

    localStorage.setItem(
      'quizValues',
      JSON.stringify({
        ...storedQuizData,
        ...formattedResponse,
      })
    );
  } catch (error) {
    console.error(`Error in fetching zipcode data`, error.message);
  }
}
