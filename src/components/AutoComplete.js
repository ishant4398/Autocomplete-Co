import React, { useEffect, useRef, useState } from "react";
import useDebounce from "../utils/hooks/useDebounce";
import { Link, useNavigate } from "react-router-dom";
/*
Optimizations:-
1. Debouncing
2. Caching
3. Caching max Length
4. Minimum Input value query
5. Auto Retry
6. Error Handling
7. Manual Retry Button
8. Automatic deletion of Cache on unmounting of component
9. UI/UX
10. Accessbility - Screen Readers and Keyboard Navigations
*/
const AutoComplete = () => {
  const [inputValue, setInputValue] = useState("");
  const inputSearchRef = useRef(null);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [isShowResuts, setIsShowResuts] = useState(false);
  const searchResultsCacheRef = useRef(new Map());

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const autoRetryRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedInputValue.trim().length >= 3) fetchSearchResults();
  }, [debouncedInputValue]);

  useEffect(() => {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
    }

    // Clear cache on unmounting
    return () => {
      clearSearchResultCache();
    };
  }, []);

  const clearSearchResultCache = () => {
    const searchCacheMap = searchResultsCacheRef?.current;
    searchCacheMap.clear();
  };

  const setSearchResultCache = (inputValueTrimmed, searchResults) => {
    // Maximum size of cache is 10 items
    const searchCacheMap = searchResultsCacheRef?.current;
    if (searchCacheMap.size > 10) {
      let firstKey = searchCacheMap.keys().next().value;
      searchCacheMap.delete(firstKey);
    }
    searchCacheMap.set(inputValueTrimmed, searchResults);
  };

  const fetchSearchResults = async () => {
    try {
      let inputValueTrimmed = inputValue?.trim();
      let searchResults = [];

      if (searchResultsCacheRef?.current?.has(inputValueTrimmed)) {
        searchResults = searchResultsCacheRef?.current?.get(inputValueTrimmed);
      } else {
        setLoading(true);
        const data = await fetch(
          `https://www.google.com/complete/search?client=firefox&q=${inputValueTrimmed}`
        );

        if (!data.ok) {
          throw new Error(data.status);
        }

        const results = await data.json();
        searchResults = results[1];

        // Max cache length is 10 items
        setSearchResultCache(inputValueTrimmed, searchResults);
      }
      setLoading(false);
      setSearchResults(searchResults);
    } catch (err) {
      setLoading(false);
      setIsError(true);
      if (!autoRetryRef.current) {
        autoRetryRef.current = true;
        fetchSearchResults();
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputFocus = (e) => {
    setIsShowResuts(true);
  };
  const handleInputBlur = (e) => {
    setIsShowResuts(false);
  };

  const goToView = (results) => {
    console.log(results);
    navigate("/view/" + results);
  };

  const handleRetry = () => {
    fetchSearchResults();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Autocomplete Component</h1>
      <div>
        <input
          className="border rounded-lg p-2 mt-6 mb-2 w-[500px] h-14 shadow-lg"
          ref={inputSearchRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          //   onBlur={handleInputBlur}
        />
        {!(loading || isError) && isShowResuts && (
          <ul className="shadow-lg py-1 rounded-b-lg" role="list">
            {searchResults?.length > 0 &&
              searchResults?.map((result) => (
                <Link
                  to={"/view/" + result}
                  key={result}
                  className="flex p-1 m-2 my-4 border border-b-black cursor-pointer hover:bg-gray-200"
                >
                  {result}
                </Link>
              ))}
          </ul>
        )}
        {loading && <h1>Loading.....</h1>}
        {isError && <button onClick={handleRetry}> Retry </button>}
      </div>
    </div>
  );
};

export default AutoComplete;
