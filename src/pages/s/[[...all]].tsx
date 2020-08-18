import React from 'react'
import {useRouter} from 'next/router'
import {findResultsState} from 'react-instantsearch-dom/server'
import algoliasearchLite from 'algoliasearch/lite'
import Search from '@components/search'
import {NextSeo} from 'next-seo'

import qs from 'qs'
import {createUrl, parseUrl, titleFromPath} from '@lib/search-url-builder'
import {isEmpty} from 'lodash'

const createURL = (state) => `?${qs.stringify(state)}`

const fullTextSearch = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP || '',
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_KEY || '',
}

const searchClient = algoliasearchLite(
  fullTextSearch.appId,
  fullTextSearch.searchApiKey,
)

const defaultProps = {
  searchClient,
  indexName: 'content_production',
}

export default function SearchIndex({
  initialSearchState,
  resultsState,
  pageTitle,
}) {
  const [searchState, setSearchState] = React.useState(initialSearchState)
  const debouncedState = React.useRef<any>()
  const router = useRouter()

  const onSearchStateChange = (searchState) => {
    clearTimeout(debouncedState.current)

    debouncedState.current = setTimeout(() => {
      const href = createUrl(searchState)

      console.log(href)

      router.push(href, href, {
        shallow: true,
      })
    }, 700)

    setSearchState(searchState)
  }
  const customProps = {
    searchState,
    resultsState,
    createURL,
    onSearchStateChange,
  }

  return (
    <div>
      <NextSeo noindex={!isEmpty(searchState.query)} title={pageTitle} />
      <Search {...defaultProps} {...customProps} />
    </div>
  )
}

export async function getServerSideProps({query}) {
  console.log(query)
  const initialSearchState = parseUrl(query)
  const pageTitle = titleFromPath(query.all)
  const {rawResults} = await findResultsState(Search, {
    ...defaultProps,
    searchState: initialSearchState,
  })

  return {
    props: {
      resultsState: {rawResults},
      initialSearchState,
      pageTitle,
    },
  }
}