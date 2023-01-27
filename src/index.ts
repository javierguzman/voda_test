import axios from "axios";

const urlRegex = new RegExp(
  "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
);

const isCorrectURL = (url: string): boolean => {
  if (urlRegex.test(url)) {
    return true;
  }
  return false;
}

const fetchURL = <DataReturned>(url: string): Promise<DataReturned> => {
  if (isCorrectURL(url)) {
    const request = axios
      .get<DataReturned>(url)
      .then((response) => {
        const { data } = response;
        return data;
      })
      .catch((err) => {
        throw err;
      });
    return request;
  } else {
    throw new Error(`Invalid url ${url}`);
  }
};

/**
 * By reading the exercise, it is not clear at all what the merge should do.
 * The example provided does not show the expected output.
 * I assume that if it is required 'id' from a bunch of users, then, it fetches all users, and then
 * returns an array of ids and nothing else
 */
const mergeData = <D>(allData: D[], key: keyof D)  => {
  return allData.map(data => data[key]);
};


const getAndMergeData = <DATA>(urls: string[], key: keyof DATA): Promise<DATA[keyof DATA][]> => {
  const urlPromises = urls.map((url) => fetchURL<DATA>(url));
  return Promise.all(urlPromises).then(allData => mergeData(allData, key)).catch(err => err);
};

// testing
// const urls = [
//   'https://pokeapi.co/api/v2/pokemon/ditto',
//   'https://pokeapi.co/api/v2/pokemon/abra'
// ];

// interface Pokemon {
//   abilities: {
//     ability: {
//       url: string;
//       name: string;
//     },
//     is_hidden: boolean;
//     slot: number;
//   }
//   base_experience: number;
//   species: {
//     name: string;
//     url: string;
//   }
// }

// const printMergedPokemons = (pokemons: Pokemon[keyof Pokemon][]) => {
//   pokemons.forEach(pokemon => {
//     console.log(pokemon);
//   });
// }

// getAndMergeData<Pokemon>(urls, 'species').then(mergedData => printMergedPokemons(mergedData)).catch(err => console.log(err));