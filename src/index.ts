const handler: ExportedHandler = {
  async fetch(request: any, env: any, ctx: any) {
    const currentWeather = env.currentWeather;
    const API_KEY = env.API_KEY;
    const host = "https://api.openweathermap.org/data/3.0/onecall";
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("content-type", "application/json;charset=UTF-8")

    // Get the value of the "city" query parameter from the request URL
    const url = new URL(request.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const apiUrl = `${host}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const init = {
      headers: headers
    };

    async function gatherResponse(response: any) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json());
      }
      return response.text();
    }
    
    try {
      const response = await fetch(apiUrl, init);
      const results = await gatherResponse(response);

      return new Response(results, init);
    } catch (error: any) {
      const errorMessage = `Error fetching data from OpenWeatherMap API: ${error.message}`;
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: headers
      });
    }
  },
};

export default handler;