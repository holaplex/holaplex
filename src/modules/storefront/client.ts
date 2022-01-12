const storefrontSDK = {
  getApprovedSubdomains: async (url?: string): Promise<string[] | null> => {
    if (!url) {
      return null;
    }

    const response = await fetch(url)
    const json = await response.json()

    return json;
  }
}

export default storefrontSDK;