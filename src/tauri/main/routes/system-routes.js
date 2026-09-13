export function registerSystemRoutes(router, context, { jsonResponse }) {
    router.all('/csrf-token', async () => jsonResponse({ token: 'tauri-dummy-token' }));

    router.all('/version', async () => {
        const versionInfo = await context.safeInvoke('get_client_version');
        return jsonResponse(versionInfo);
    });

    router.all('/api/ping', async () => jsonResponse({ result: 'ok' }));

    router.all('/api/modules', async () => jsonResponse([]));

    const handleVisit = async ({ body }) => {
        const targetUrl = String(body?.url || '').trim();
        if (!targetUrl) {
            return jsonResponse({ error: 'No url specified' }, 400);
        }
        try {
            const raw = await context.safeInvoke('visit_url', { url: targetUrl });
            return new Response(raw, {
                status: 200,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
        } catch (err) {
            return jsonResponse({ error: String(err?.message || err) }, 500);
        }
    };

    router.all('/api/search/visit', handleVisit);
    router.all('/api/serpapi/visit', handleVisit);
}
