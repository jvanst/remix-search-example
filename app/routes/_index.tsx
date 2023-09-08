import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { search } from "../api/search";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Remix search example" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const query = new URL(request.url).searchParams.get('q')
  let results
  
  if (query) results = await search(query)

  return json({
    query,
    results,
  });
}


export default function Index() {
  const { query, results } = useLoaderData<typeof loader>();
  const navigate = useNavigate()
  const navigation = useNavigation();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    navigate({
      pathname: '/',
      search: `?q=${event.target.value}`,
    });
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow max-w-lg mx-auto mt-24">
      <div className="px-4 py-5 sm:p-6">
        <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
          Search
        </label>
        <div className="relative mt-2 flex items-center">
          <input
            defaultValue={query || ''}
            onChange={handleChange}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      { navigation.state === 'loading' ?
        // Show spinner when navigation is loading
        <div className="py-4 text-sm text-gray-500 w-4 mx-auto">
          <div role="status">
              <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
        </div>
        : query ? 
        // If a query was provided, show results
        <>
          <div className="px-4">
            {results?.query?.search.map((result: any) => 
              <div key={result.pageid} className="px-4 py-3 text-sm">
                { result.title }
              </div>
            )}
          </div>
          <div className="text-center py-4 text-sm text-gray-500">
            Total hits: { results?.query?.searchinfo.totalhits }
          </div>
        </> :
        // If no query was provided, prompt user
        <div className="text-center py-4 text-sm text-gray-500">
          Get started by searching for something!    
        </div>
      }
    </div>
  )
}
