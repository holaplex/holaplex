 
export async function checkStorefrontAvailability(subdomain: string, dispatch: React.Dispatch<any>) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('running fetch', { subdomain })

   try {
    const response = await fetch(`/api/storefronts?subdomain=${subdomain}`, requestOptions);
    const data = await response.json()

    if (data.subdomain === subdomain) {
      dispatch({
        type: 'UPDATE_SUBDOMAIN_AVAILABILITY',
        payload: {
          available: false,
          desiredStorefrontSubdomain: subdomain
        },
      })
    } else {
      dispatch({
        type: 'UPDATE_SUBDOMAIN_AVAILABILITY',
        payload: {
          available: true,
          desiredStorefrontSubdomain: subdomain
        },
      })
    }
    return;

   } catch (error) {
     dispatch({ type: 'UPDATE_SUBDOMAIN_AVAILABILITY', payload: { error }})
   }

}
 