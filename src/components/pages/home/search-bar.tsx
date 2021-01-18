import * as React from 'react'
import Card from './card'
import {Form, Formik} from 'formik'
import {useRouter} from 'next/router'
import {track} from 'utils/analytics'

const SearchBar = () => {
  const router = useRouter()
  return (
    <Card>
      <Formik
        initialValues={{
          query: '',
        }}
        onSubmit={(values) => {
          router.push(`/q?q=${values.query}`)
          track('searched for query', {
            query: values.query,
            location: 'home',
          })
        }}
      >
        {({values, handleChange}) => {
          return (
            <Form role="search">
              <div className="flex items-center flex-grow space-x-2">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* prettier-ignore */}
                    <svg className="text-gray-500" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                  </div>
                  <input
                    name="query"
                    value={values.query}
                    onChange={handleChange}
                    type="search"
                    placeholder={`What do you want to learn today?`}
                    className="form-input bg-gray-100 rounded-md px-5 py-3 pl-10 w-full border border-transparent focus:outline-none focus:border-gray-400 placeholder-gray-600"
                  />
                </div>
                <button
                  type="submit"
                  className={`block font-semibold px-5 py-3 text-base hover:scale-105 transform bg-blue-600 hover:bg-blue-700 transition-all ease-in-out duration-200 text-white rounded-md leading-6`}
                >
                  search
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Card>
  )
}

export default SearchBar
