/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCioAutocomplete } from '@constructor-io/constructorio-ui-autocomplete';
import '@constructor-io/constructorio-ui-autocomplete/styles.css';
import cioClient from '../../app/cioClient';

function AutocompleteSearch() {
  const navigate = useNavigate();

  const submitSearch = (e) => {
    const { query, item } = e;

    if (query) {
      navigate(`/search?q=${query}`);
    } else if (item?.value) {
      navigate(`/search?q=${item?.value}`);
    }
  };

  const {
    isOpen,
    sections,
    getFormProps,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    setQuery,
    autocompleteClassName,
  } = useCioAutocomplete({
    cioJsClient: cioClient,
    onSubmit: submitSearch,
    placeholder: 'Search...',
  });

  const inputProps = getInputProps();

  return (
    <div className={autocompleteClassName}>
      <form
        {...getFormProps()}
        data-cnstrc-search-form
      >
        <label {...getLabelProps()} htmlFor="cio-search-input" hidden>
          Search
        </label>
        <input
          id="cio-search-input"
          {...inputProps}
          data-cnstrc-search-input
        />
        <button
          className="cio-clear-btn"
          type="button"
          hidden={!inputProps.value}
          onClick={() => {
            setQuery('');
            setTimeout(() => document.getElementById('cio-search-input')?.focus(), 100);
          }}
          aria-label="Clear search field text"
        >
          <div className="cio-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
            </svg>
          </div>
        </button>
        <button
          className="cio-submit-btn"
          type="submit"
          disabled={!inputProps.value}
          aria-label="Submit Search"
          data-cnstrc-search-submit-btn
        >
          <div className="cio-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
          </div>
        </button>
      </form>
      <ul
        {...getMenuProps()}
        data-cnstrc-autosuggest
        style={!isOpen ? { display: 'none' } : undefined}
      >
        {isOpen && sections?.map((section) => (
          <div key={section.identifier} className={`cio-section ${section.identifier.replace(/\s/g, '')}`}>
            <div className="cio-sectionName">
              {section?.displayName || section.identifier}
            </div>
            <div className="cio-items">
              {section?.data?.map((item) => {
                const isProduct = section.identifier !== 'Search Suggestions';
                const isInGroup = !!item.groupName;

                return (
                  <li
                    {...getItemProps(item)}
                    key={item.id || item.value}
                    data-cnstrc-item-section={section.identifier}
                    data-cnstrc-item-name={item.value}
                    {...(isProduct && item.data?.id ? { 'data-cnstrc-item-id': item.data.id } : {})}
                    {...(isInGroup && item.group?.group_id ? { 'data-cnstrc-item-group': item.group.group_id } : {})}
                    {...(item.labels?.sl_campaign_id ? { 'data-cnstrc-sl-campaign-id': item.labels.sl_campaign_id } : {})}
                    {...(item.labels?.sl_campaign_owner ? { 'data-cnstrc-sl-campaign-owner': item.labels.sl_campaign_owner } : {})}
                  >
                    {isProduct ? (
                      <>
                        {item.data?.image_url && (
                          <img src={item.data.image_url} alt={item.value} />
                        )}
                        <p>{item.value}</p>
                      </>
                    ) : isInGroup ? (
                      <p className="cio-term-in-group">in {item.groupName}</p>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </li>
                );
              })}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default AutocompleteSearch;
