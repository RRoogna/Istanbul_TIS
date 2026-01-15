import * as React from 'react';
import { createContext, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import cioClient from './app/cioClient';
import AutocompleteSearch from './components/AutocompleteSearch';
import ConstructorLogo from './components/ConstructorLogo';
import FacetFilters from './components/Filters/FacetFilters';
import FiltersMobile from './components/Filters/FiltersMobile';
import GroupFilters from './components/Filters/GroupFilters';
import SortOptions from './components/Filters/SortOptions';
import MainNavbar from './components/MainNavbar';
import { useCart } from './context/CartContext';

// NOTE //
/*
  groups => groupsFilters which changes based on the current browse page
  browseGroups => browse navigation links which are fixed despite of the current browse page
*/

export const FiltersContext = createContext({});

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [params] = useSearchParams();
  const query = params?.get('q');
  const [facets, setFacets] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [browseGroups, setBrowseGroups] = React.useState([]);
  const [rootBrowseGroupId, setRootBrowseGroupId] = React.useState([]);
  let browseName = location.pathname.match(/[^/]+$/)?.[0];

  if (browseName === 'search') {
    browseName = '';
  }

  const filtersContextValues = React.useMemo(
    () => ({
      groups,
      setFacets,
      setGroups,
      setSortOptions,
      rootBrowseGroupId,
      browseGroups,
    }),
    [groups, rootBrowseGroupId, browseGroups]
  );

  React.useEffect(() => {
    (async () => {
      try {
        const res = await cioClient.browse.getBrowseGroups();
        setBrowseGroups(res?.response?.groups?.[0]?.children);
        setRootBrowseGroupId(res?.response?.groups?.[0]?.group_id);
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  return (
    <div className="text-lg sm:text-base">
      <div className="flex flex-col sm:flex-row justify-between sm:ml-auto sm:mr-auto mb-2 md:mb-5 relative">
        <ConstructorLogo />
        <div className="flex items-center gap-4">
          <AutocompleteSearch />
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <MainNavbar browseGroups={browseGroups} />
      <div className="flex pb-10">
        {location.pathname !== '/' && (
          <div
            id="search-filters"
            className="w-[200px] hidden sm:block mr-5 p-2"
          >
            {!!groups.length && <GroupFilters groups={groups} />}
            {!!facets.length && <FacetFilters facets={facets} />}
          </div>
        )}
        <div className="items-center w-full">
          {location.pathname !== '/' &&
            !location.pathname.startsWith('/product/') &&
            !location.pathname.startsWith('/cart') &&
            !location.pathname.startsWith('/checkout') &&
            !location.pathname.startsWith('/order-confirmation') && (
              <div className="flex flex-col sm:flex-row align-end justify-between items-center sm:items-start mb-6">
                <h1 className="text-3xl order-2 sm:order-1 font-medium text-stone-800">
                  {query && (
                    <>
                      <span className="text-stone-400 font-normal">
                        Results for{' '}
                      </span>
                      &ldquo;{query}&rdquo;
                    </>
                  )}
                  {!query &&
                    (browseName === 'browse'
                      ? 'All Products'
                      : decodeURI(browseName))}
                </h1>
                <div className="flex order-1 sm:order-2 mb-4 md:mb-0 w-full sm:w-auto gap-3">
                  <SortOptions sortOptions={sortOptions} />
                  <FiltersMobile groups={groups} facets={facets} />
                </div>
              </div>
            )}
          <FiltersContext.Provider value={filtersContextValues}>
            <Outlet />
          </FiltersContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default Layout;
