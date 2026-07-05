(function () {
  const currentScript = document.currentScript;
  const mainScript = currentScript ? currentScript.dataset.main : "./main.js";
  const params = new URLSearchParams(window.location.search);
  const configuredBase = window.WEST_LAKE_API_BASE || params.get("apiBase") || "";
  const shouldUseApi = params.get("api") === "1" || Boolean(configuredBase);

  function loadMain() {
    const script = document.createElement("script");
    script.src = mainScript || "./main.js";
    document.body.appendChild(script);
  }

  function endpoint(path) {
    const base = String(configuredBase || "").replace(/\/$/, "");
    return `${base}${path}`;
  }

  function applyApiContent(payload) {
    if (!payload || !payload.data || typeof payload.data !== "object") return;
    window.WEST_LAKE_CONTENT = {
      ...(window.WEST_LAKE_CONTENT || {}),
      ...payload.data,
    };
    window.WEST_LAKE_CONTENT_SOURCE = "api";
  }

  if (!shouldUseApi) {
    window.WEST_LAKE_CONTENT_SOURCE = "static";
    loadMain();
    return;
  }

  fetch(endpoint("/api/v1/app-content"), {
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API content request failed: ${response.status}`);
      }
      return response.json();
    })
    .then(applyApiContent)
    .catch((error) => {
      window.WEST_LAKE_CONTENT_SOURCE = "static-fallback";
      console.warn("[westlake] Falling back to static content-data.js", error);
    })
    .finally(loadMain);
})();
